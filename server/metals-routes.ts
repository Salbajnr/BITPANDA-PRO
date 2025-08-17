
import { Router } from 'express';
import { metalsService } from './metals-service';

const router = Router();

// Get single metal price
router.get('/price/:metal', async (req, res) => {
  try {
    const { metal } = req.params;
    const price = await metalsService.getPrice(metal);
    
    if (!price) {
      return res.status(404).json({ 
        message: `Price not found for ${metal}` 
      });
    }

    res.json(price);
  } catch (error) {
    console.error('Error fetching metal price:', error);
    res.status(500).json({ 
      message: 'Failed to fetch price data' 
    });
  }
});

// Get all metal prices
router.get('/prices', async (req, res) => {
  try {
    const prices = await metalsService.getAllPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    res.status(500).json({ 
      message: 'Failed to fetch metal prices' 
    });
  }
});

// Clear cache (admin only)
router.post('/clear-cache', async (req, res) => {
  try {
    metalsService.clearCache();
    res.json({ 
      message: 'Metals price cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ 
      message: 'Failed to clear cache' 
    });
  }
});

export default router;
