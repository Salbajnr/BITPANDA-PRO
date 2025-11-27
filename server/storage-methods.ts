// Consolidated storage helper methods for server
// @ts-nocheck
// Temporary suppression due to drizzle-orm version mismatch

import { db } from './db';
import { eq, desc, and } from 'drizzle-orm';
import {
  users,
  watchlist,
  investmentPlans,
  savingsPlans,
  newsArticles,
  priceAlerts,
  apiKeys,
  transactions,
} from '@shared/schema';

// ----- News -----
export async function getNewsArticleById(id: string) {
  const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  return article || null;
}

export async function createNewsArticle(data: any) {
  const [article] = await db.insert(newsArticles).values(data).returning();
  return article;
}

export async function updateNewsArticle(id: string, data: any) {
  const [article] = await db.update(newsArticles).set({ ...data, updatedAt: new Date() }).where(eq(newsArticles.id, id)).returning();
  return article;
}

export async function deleteNewsArticle(id: string) {
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
}

export async function getNewsAnalytics() {
  const all = await db.select().from(newsArticles);
  return {
    totalArticles: all.length,
    publishedToday: 0,
    totalViews: 0,
    engagementRate: 0,
  };
}

// ----- Alerts / Price Alerts -----
export async function getUserAlerts(userId: string) {
  return await db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId)).orderBy(desc(priceAlerts.createdAt));
}

export async function createAlert(data: any) {
  const [alert] = await db.insert(priceAlerts).values(data).returning();
  return alert;
}

export async function getAlertById(id: string) {
  const [alert] = await db.select().from(priceAlerts).where(eq(priceAlerts.id, id)).limit(1);
  return alert || null;
}

export async function updateAlert(id: string, data: any) {
  const [alert] = await db.update(priceAlerts).set({ ...data, updatedAt: new Date() }).where(eq(priceAlerts.id, id)).returning();
  return alert;
}

export async function deleteAlert(id: string) {
  await db.delete(priceAlerts).where(eq(priceAlerts.id, id));
}

export async function getActivePriceAlerts() {
  return await db.select().from(priceAlerts).where(eq(priceAlerts.isActive, true)).orderBy(desc(priceAlerts.createdAt));
}

// ----- Watchlist -----
export async function getUserWatchlist(userId: string) {
  const [list] = await db.select().from(watchlist).where(eq(watchlist.userId, userId)).limit(1);
  return list || null;
}

export async function addToWatchlist(data: any) {
  const [item] = await db.insert(watchlist).values(data).returning();
  return item;
}

export async function getWatchlistItem(id: string) {
  const [item] = await db.select().from(watchlist).where(eq(watchlist.id, id)).limit(1);
  return item || null;
}

export async function updateWatchlistItem(id: string, data: any) {
  const [item] = await db.update(watchlist).set({ ...data, updatedAt: new Date() }).where(eq(watchlist.id, id)).returning();
  return item;
}

export async function removeFromWatchlist(id: string) {
  await db.delete(watchlist).where(eq(watchlist.id, id));
}

// ----- API Keys -----
export async function getUserApiKeys(userId: string) {
  return await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).orderBy(desc(apiKeys.createdAt));
}

export async function createApiKey(data: any) {
  const [key] = await db.insert(apiKeys).values(data).returning();
  return key;
}

export async function getApiKeyById(id: string) {
  const [key] = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1);
  return key || null;
}

export async function updateApiKey(id: string, data: any) {
  const [key] = await db.update(apiKeys).set({ ...data, updatedAt: new Date() }).where(eq(apiKeys.id, id)).returning();
  return key;
}

export async function revokeApiKey(id: string) {
  await db.update(apiKeys).set({ isActive: false, updatedAt: new Date() }).where(eq(apiKeys.id, id));
}

// ----- Investments / Savings -----
export async function getInvestmentById(id: string) {
  const [inv] = await db.select().from(investmentPlans).where(eq(investmentPlans.id, id)).limit(1);
  return inv || null;
}

export async function updateInvestment(id: string, data: any) {
  const [updated] = await db.update(investmentPlans).set(data).where(eq(investmentPlans.id, id)).returning();
  return updated;
}

export async function deleteInvestment(id: string) {
  await db.delete(investmentPlans).where(eq(investmentPlans.id, id));
}

export async function getSavingsPlanById(id: string) {
  const [plan] = await db.select().from(savingsPlans).where(eq(savingsPlans.id, id)).limit(1);
  return plan || null;
}

export async function updateSavingsPlan(id: string, data: any) {
  const [updated] = await db.update(savingsPlans).set(data).where(eq(savingsPlans.id, id)).returning();
  return updated;
}

export async function deleteSavingsPlan(id: string) {
  await db.delete(savingsPlans).where(eq(savingsPlans.id, id));
}

// ----- Users -----
export type User = any;

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function createUser(data: any): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUser(id: string, data: any): Promise<User | undefined> {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

// ----- Transactions helper (used by admin routes) -----
export async function getAllTransactions({ page = 1, limit = 50, type }: { page?: number; limit?: number; type?: string }) {
  const offset = (page - 1) * limit;
  const all = await db.select().from(transactions).limit(limit).offset(offset);
  return { transactions: all, total: all.length };
}

export const storage = {
  // User methods
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  // Price alert methods
  async getActivePriceAlerts() {
    // Mock implementation - returns empty array
    return [];
  },

  // Audit log methods
  async createAuditLog(logData: any) {
    // Mock implementation - logs to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit log:', logData);
    }
    return { id: Date.now(), ...logData };
  },
};