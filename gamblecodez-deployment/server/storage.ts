import {
  users,
  links,
  promoEvents,
  type User,
  type UpsertUser,
  type Link,
  type InsertLink,
  type UpdateLink,
  type PromoEvent,
  type InsertPromoEvent,
  type UpdatePromoEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, like } from "drizzle-orm";

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
  
  // Promo Events operations
  getPromoEvents(date?: Date): Promise<PromoEvent[]>;
  getPromoEventById(id: number): Promise<PromoEvent | undefined>;
  createPromoEvent(event: InsertPromoEvent): Promise<PromoEvent>;
  updatePromoEvent(id: number, event: UpdatePromoEvent): Promise<PromoEvent>;
  deletePromoEvent(id: number): Promise<void>;
  getActivePromoEvents(): Promise<PromoEvent[]>;
  findAffiliateLink(casinoName: string): Promise<Link | undefined>;
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
    if (category) {
      return await db
        .select()
        .from(links)
        .where(and(eq(links.isActive, true), eq(links.category, category)))
        .orderBy(desc(links.isPinned), desc(links.createdAt));
    }
    
    return await db
      .select()
      .from(links)
      .where(eq(links.isActive, true))
      .orderBy(desc(links.isPinned), desc(links.createdAt));
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
      .set({ clickCount: sql`${links.clickCount} + 1` })
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

  // Promo Events operations
  async getPromoEvents(date?: Date): Promise<PromoEvent[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await db
        .select()
        .from(promoEvents)
        .where(
          and(
            eq(promoEvents.isActive, true),
            lte(promoEvents.startDate, endOfDay),
            gte(promoEvents.endDate, startOfDay)
          )
        )
        .orderBy(desc(promoEvents.startDate));
    }

    return await db
      .select()
      .from(promoEvents)
      .where(eq(promoEvents.isActive, true))
      .orderBy(desc(promoEvents.startDate));
  }

  async getPromoEventById(id: number): Promise<PromoEvent | undefined> {
    const [event] = await db.select().from(promoEvents).where(eq(promoEvents.id, id));
    return event;
  }

  async createPromoEvent(eventData: InsertPromoEvent): Promise<PromoEvent> {
    // Try to find affiliate link automatically
    if (eventData.casinoName && !eventData.affiliateUrl) {
      const affiliateLink = await this.findAffiliateLink(eventData.casinoName);
      if (affiliateLink) {
        eventData.affiliateUrl = affiliateLink.url;
      }
    }

    const [event] = await db.insert(promoEvents).values(eventData).returning();
    return event;
  }

  async updatePromoEvent(id: number, eventData: UpdatePromoEvent): Promise<PromoEvent> {
    // Try to find affiliate link automatically if casino name changed
    if (eventData.casinoName && !eventData.affiliateUrl) {
      const affiliateLink = await this.findAffiliateLink(eventData.casinoName);
      if (affiliateLink) {
        eventData.affiliateUrl = affiliateLink.url;
      }
    }

    const [event] = await db
      .update(promoEvents)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(promoEvents.id, id))
      .returning();
    return event;
  }

  async deletePromoEvent(id: number): Promise<void> {
    await db.update(promoEvents).set({ isActive: false }).where(eq(promoEvents.id, id));
  }

  async getActivePromoEvents(): Promise<PromoEvent[]> {
    const now = new Date();
    return await db
      .select()
      .from(promoEvents)
      .where(
        and(
          eq(promoEvents.isActive, true),
          lte(promoEvents.startDate, now),
          gte(promoEvents.endDate, now)
        )
      )
      .orderBy(desc(promoEvents.startDate));
  }

  async findAffiliateLink(casinoName: string): Promise<Link | undefined> {
    const searchTerm = casinoName.toLowerCase();
    const [link] = await db
      .select()
      .from(links)
      .where(
        and(
          eq(links.isActive, true),
          like(sql`LOWER(${links.name})`, `%${searchTerm}%`)
        )
      )
      .limit(1);
    return link;
  }
}

export const storage = new DatabaseStorage();
