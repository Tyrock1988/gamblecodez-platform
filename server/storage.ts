import {
  users,
  links,
  type User,
  type UpsertUser,
  type Link,
  type InsertLink,
  type UpdateLink,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Link operations
  getLinks(category?: string): Promise<Link[]>;
  getLinkById(id: number): Promise<Link | undefined>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, link: UpdateLink): Promise<Link>;
  deleteLink(id: number): Promise<void>;
  incrementClickCount(id: number): Promise<void>;
  getActivePromos(): Promise<Link[]>;
  getLinkStats(): Promise<{
    totalLinks: number;
    activePromos: number;
    socialLinks: number;
    totalClicks: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Link operations
  async getLinks(category?: string): Promise<Link[]> {
    const query = db.select().from(links).where(eq(links.isActive, true));
    
    if (category) {
      query.where(and(eq(links.isActive, true), eq(links.category, category)));
    }
    
    return await query.orderBy(desc(links.isPinned), desc(links.createdAt));
  }

  async getLinkById(id: number): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link;
  }

  async createLink(linkData: InsertLink): Promise<Link> {
    const [link] = await db.insert(links).values(linkData).returning();
    return link;
  }

  async updateLink(id: number, linkData: UpdateLink): Promise<Link> {
    const [link] = await db
      .update(links)
      .set({ ...linkData, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return link;
  }

  async deleteLink(id: number): Promise<void> {
    await db.update(links).set({ isActive: false }).where(eq(links.id, id));
  }

  async incrementClickCount(id: number): Promise<void> {
    await db
      .update(links)
      .set({ clickCount: db.select().from(links).where(eq(links.id, id)) })
      .where(eq(links.id, id));
  }

  async getActivePromos(): Promise<Link[]> {
    return await db
      .select()
      .from(links)
      .where(and(eq(links.isActive, true), eq(links.isPinned, true)))
      .orderBy(desc(links.createdAt));
  }

  async getLinkStats(): Promise<{
    totalLinks: number;
    activePromos: number;
    socialLinks: number;
    totalClicks: number;
  }> {
    const allLinks = await db.select().from(links).where(eq(links.isActive, true));
    
    return {
      totalLinks: allLinks.length,
      activePromos: allLinks.filter(link => link.isPinned).length,
      socialLinks: allLinks.filter(link => link.category === 'socials').length,
      totalClicks: allLinks.reduce((sum, link) => sum + (link.clickCount || 0), 0),
    };
  }
}

export const storage = new DatabaseStorage();
