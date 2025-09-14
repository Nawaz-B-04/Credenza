import { db } from '../config/dbClient.js';
import { users, stores, ratings } from '../config/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

export const createUserOrAdmin = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await db.insert(users).values({
    name,
    email,
    password: hashed,
    address,
    role, 
  }).returning();

  const token = generateToken({ id: newUser[0].id, role: newUser[0].role });

  res.status(201).json({
    user: {
      id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      role: newUser[0].role,
      address: newUser[0].address,
    },
    token,
  }); 
};

export const createStore = async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await db.select().from(stores).where(eq(stores.email, email));
  if (existing.length > 0) return res.status(400).json({ message: 'Email already used by a store' });

  const hashed = await bcrypt.hash(password, 10);
  const newStore = await db.insert(stores).values({
    name,
    email: email.toLowerCase(),
    address,
    password: hashed,
    role: 'store',
  }).returning();

  const token = generateToken({ id: newStore[0].id, role: 'store' });

  res.status(201).json({
    store: {
      id: newStore[0].id,
      name: newStore[0].name,
      email: newStore[0].email,
      address: newStore[0].address,
      role: newStore[0].role,
    },
    token,
  });
};

export const getAllUsers = async (req, res) => {
  const all = await db.select().from(users);
  res.json(all);
};

export const getAdminsOnly = async (req, res) => {
  const admins = await db.select().from(users).where(eq(users.role, 'admin'));
  res.json(admins);
};

export const getAllStoresWithStats = async (req, res) => {
  const allStores = await db.select().from(stores);
  const allRatings = await db.select().from(ratings);

  const result = allStores.map(store => {
    const ratingsForStore = allRatings.filter(r => r.storeId === store.id);
    const avg =
      ratingsForStore.reduce((sum, r) => sum + r.rating, 0) / (ratingsForStore.length || 1);

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      email: store.email,
      totalRatings: ratingsForStore.length,
      averageRating: Number(avg.toFixed(2)),
    };
  });

  res.json(result);
};

export const getSystemStats = async (req, res) => {
  const usersCount = await db.select().from(users);
  const storesCount = await db.select().from(stores);
  const ratingsCount = await db.select().from(ratings);

  res.json({
    totalUsers: usersCount.length,
    totalStores: storesCount.length,
    totalRatings: ratingsCount.length,
  });
};
