
import { Router } from 'express';
import { requireAuth, requireAdmin } from './simple-auth';
import { storage } from './storage';
import { insertNewsArticleSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Get all news articles (public)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const search = req.query.search as string;
    
    const articles = await storage.getNewsArticles(limit, category, search);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news articles' });
  }
});

// Get single news article by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const article = await storage.getNewsArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

// Admin: Create news article
router.post('/', requireAdmin, async (req, res) => {
  try {
    const articleData = insertNewsArticleSchema.parse(req.body);
    const article = await storage.createNewsArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create article' });
  }
});

// Admin: Update news article
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const article = await storage.updateNewsArticle(req.params.id, updates);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Failed to update article' });
  }
});

// Admin: Delete news article
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await storage.deleteNewsArticle(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Failed to delete article' });
  }
});

// Admin: Get news analytics
router.get('/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const analytics = await storage.getNewsAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching news analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
