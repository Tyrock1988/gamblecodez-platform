import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  serial,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(), // 'us', 'non-us', 'everywhere', 'faucet', 'socials'
  tags: text("tags").array().default([]), // 'kyc', 'no-kyc', 'vpn'
  promoText: text("promo_text"),
  isPinned: boolean("is_pinned").default(false),
  isActive: boolean("is_active").default(true),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promoEvents = pgTable("promo_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  promoCode: text("promo_code"),
  casinoName: text("casino_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  tags: text("tags").array().default([]), // casino tags for automatic link matching
  affiliateUrl: text("affiliate_url"), // automatically populated from links table
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users),
}));

export const promoEventsRelations = relations(promoEvents, ({ one }) => ({
  user: one(users),
}));

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  clickCount: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLinkSchema = insertLinkSchema.partial();

export const insertPromoEventSchema = createInsertSchema(promoEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePromoEventSchema = insertPromoEventSchema.partial();

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type UpdateLink = z.infer<typeof updateLinkSchema>;
export type PromoEvent = typeof promoEvents.$inferSelect;
export type InsertPromoEvent = z.infer<typeof insertPromoEventSchema>;
export type UpdatePromoEvent = z.infer<typeof updatePromoEventSchema>;
