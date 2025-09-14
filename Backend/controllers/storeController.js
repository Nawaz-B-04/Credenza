// controllers/storeController.js
import { db } from '../config/dbClient.js';
import { stores, ratings, users } from '../config/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

export const storeLogin = async (req, res) => {
  const { email, password } = req.body;

  const result = await db.select().from(stores).where(eq(stores.email, email));
  const store = result[0];

  if (!store) return res.status(404).json({ message: 'Store not found' });

  const isMatch = await bcrypt.compare(password, store.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken({ id: store.id, role: store.role });

  res.json({
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      role: store.role,
    },
    token,
  });
};
export const storeRatingsStats = async (req, res) => {
  const storeId = req.user.id;

  // Get all ratings for this store
  const ratingsList = await db
    .select({
      userId: ratings.userId,
      rating: ratings.rating,
      userEmail: users.email,
    })
    .from(ratings)
    .where(eq(ratings.storeId, storeId))
    .innerJoin(users, eq(users.id, ratings.userId));

  const totalRatings = ratingsList.length;
  const avgRating = ratingsList.reduce((acc, r) => acc + r.rating, 0) / (totalRatings || 1);

  res.json({
    storeId,
    totalRatings,
    averageRating: avgRating.toFixed(2),
    ratings: ratingsList,
  });
};

export const updateStorePassword = async (req, res) => {
  const storeId = req.user.id;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: 'New password required' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(stores).set({ password: hashed }).where(eq(stores.id, storeId));

  res.json({ message: 'Store password updated successfully' });
};
