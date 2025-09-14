// controllers/userController.js
import { db } from '../config/dbClient.js';
import { ratings, stores, users } from '../config/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// ✅ Admin - Get all users (role: 'user' only)
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'user'));

    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ✅ User - Update own password
export const updatePassword = async (req, res) => {
  const { id } = req.user;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password too weak (min 8 chars).' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashed }).where(eq(users.id, id));
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password' });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const allStores = await db.select().from(stores);
    const allRatings = await db.select().from(ratings);

    const result = allStores.map((store) => {
      const relatedRatings = allRatings.filter(r => r.storeId === store.id);
      const totalRatings = relatedRatings.length;
      const averageRating = totalRatings === 0
        ? 0
        : relatedRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: Number(averageRating.toFixed(2)),
        totalRatings,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores with ratings' });
  }
};