
import { db } from './db';
import { 
  newsArticles, 
  priceAlerts, 
  users,
  watchlistItems,
  apiKeys
} from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';

// News Articles
export async function createNewsArticle(data: any) {
  const [article] = await db.insert(newsArticles).values(data).returning();
  return article;
}

export async function updateNewsArticle(id: string, data: any) {
  const [article] = await db
    .update(newsArticles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(newsArticles.id, id))
    .returning();
  return article;
}

export async function deleteNewsArticle(id: string) {
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
}

export async function getNewsAnalytics() {
  const [total] = await db
    .select({ count: db.sql`count(*)` })
    .from(newsArticles);
    
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [todayCount] = await db
    .select({ count: db.sql`count(*)` })
    .from(newsArticles)
    .where(db.sql`${newsArticles.createdAt} >= ${today}`);

  return {
    totalArticles: Number(total.count || 0),
    publishedToday: Number(todayCount.count || 0),
    totalViews: 0,
    engagementRate: 0
  };
}

// Alerts
export async function getUserAlerts(userId: string) {
  return await db
    .select()
    .from(priceAlerts)
    .where(eq(priceAlerts.userId, userId))
    .orderBy(desc(priceAlerts.createdAt));
}

export async function createAlert(data: any) {
  const [alert] = await db.insert(priceAlerts).values(data).returning();
  return alert;
}

export async function getAlertById(id: string) {
  const [alert] = await db
    .select()
    .from(priceAlerts)
    .where(eq(priceAlerts.id, id))
    .limit(1);
  return alert || null;
}

export async function updateAlert(id: string, data: any) {
  const [alert] = await db
    .update(priceAlerts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(priceAlerts.id, id))
    .returning();
  return alert;
}

export async function deleteAlert(id: string) {
  await db.delete(priceAlerts).where(eq(priceAlerts.id, id));
}

// Watchlist
export async function getUserWatchlist(userId: string) {
  return await db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, userId))
    .orderBy(desc(watchlistItems.createdAt));
}

export async function addToWatchlist(data: any) {
  const [item] = await db.insert(watchlistItems).values(data).returning();
  return item;
}

export async function getWatchlistItem(id: string) {
  const [item] = await db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.id, id))
    .limit(1);
  return item || null;
}

export async function updateWatchlistItem(id: string, data: any) {
  const [item] = await db
    .update(watchlistItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(watchlistItems.id, id))
    .returning();
  return item;
}

export async function removeFromWatchlist(id: string) {
  await db.delete(watchlistItems).where(eq(watchlistItems.id, id));
}

// API Keys
export async function getUserApiKeys(userId: string) {
  return await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
}

export async function createApiKey(data: any) {
  const [key] = await db.insert(apiKeys).values(data).returning();
  return key;
}

export async function getApiKeyById(id: string) {
  const [key] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.id, id))
    .limit(1);
  return key || null;
}

export async function updateApiKey(id: string, data: any) {
  const [key] = await db
    .update(apiKeys)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(apiKeys.id, id))
    .returning();
  return key;
}

export async function revokeApiKey(id: string) {
  await db
    .update(apiKeys)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(apiKeys.id, id));
}
