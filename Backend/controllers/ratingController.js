// controllers/ratingController.js
import { db } from '../config/dbClient.js';
import { ratings } from '../config/schema.js';
import { eq, and } from 'drizzle-orm';

export const rateStore = async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;

  if (!storeId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const existingRating = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.storeId, storeId)));

  if (existingRating.length > 0) {
    // Update existing
    await db
      .update(ratings)
      .set({ rating })
      .where(and(eq(ratings.userId, userId), eq(ratings.storeId, storeId)));

    return res.json({ message: 'Rating updated' });
  } else {
    // Insert new
    await db.insert(ratings).values({ userId, storeId, rating });
    return res.status(201).json({ message: 'Rating submitted' });
  }
};
