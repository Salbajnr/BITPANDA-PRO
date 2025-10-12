
import { Router, Request, Response } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';

const router = Router();

const addToWatchlistSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  notes: z.string().optional(),
});

// Get user's watchlist
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const watchlist = await storage.getUserWatchlist(userId);
    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
});

// Add to watchlist
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = addToWatchlistSchema.parse(req.body);

    const item = await storage.addToWatchlist({
      userId,
      symbol: data.symbol,
      name: data.name,
      notes: data.notes || null,
    });

    res.json(item);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
});

// Update watchlist item
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { notes, symbol, name } = req.body;

    const item = await storage.getWatchlistItem(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    const updateData: any = {};
    if (notes !== undefined) updateData.notes = notes;
    if (symbol) updateData.symbol = symbol;
    if (name) updateData.name = name;

    const updated = await storage.updateWatchlistItem(id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ message: 'Failed to update watchlist item' });
  }
});

// Get single watchlist item
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const item = await storage.getWatchlistItem(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get watchlist item error:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist item' });
  }
});

// Remove from watchlist
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const item = await storage.getWatchlistItem(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    await storage.removeFromWatchlist(id);
    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Failed to remove from watchlist' });
  }
});

export default router;
