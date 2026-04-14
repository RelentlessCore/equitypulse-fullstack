'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: 'Not authenticated' };

    await connectToDatabase();

    const existing = await Watchlist.findOne({ userId: session.user.id, symbol: symbol.toUpperCase() });
    if (existing) return { success: true, message: 'Already in watchlist' };

    await Watchlist.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: 'Not authenticated' };

    await connectToDatabase();
    await Watchlist.deleteOne({ userId: session.user.id, symbol: symbol.toUpperCase() });

    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function getUserWatchlist() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return [];

    await connectToDatabase();
    const items = await Watchlist.find({ userId: session.user.id }).lean();
    return items.map((item) => ({
      symbol: String(item.symbol),
      company: String(item.company),
      addedAt: item.addedAt ? new Date(item.addedAt).toISOString() : null,
    }));
  } catch (err) {
    console.error('getUserWatchlist error:', err);
    return [];
  }
}