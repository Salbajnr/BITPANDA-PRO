import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { requireAuth } from './simple-auth';

const router = Router();

// Get user's watchlist
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const watchlist = await storage.getUserWatchlist(userId);
    res.json(watchlist || { userId, symbols: [] });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
});

// Add to watchlist
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { symbol, name } = req.body;

    const watchlist = await storage.addToWatchlist({
      userId,
      symbol,
      name: name || symbol
    });
    res.json(watchlist);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Failed to add to watchlist' });
  }
});

// Remove from watchlist
router.delete('/:symbol', requireAuth, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const userId = req.user!.id;

    // Find and delete the watchlist entry
    const watchlistItem = await storage.getWatchlistItem(symbol);
    if (watchlistItem) {
      await storage.removeFromWatchlist(watchlistItem.id);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Failed to remove from watchlist' });
  }
});

export default router;