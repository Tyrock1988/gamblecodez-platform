import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupSimpleAuth, isAuthenticated as simpleIsAuthenticated } from "./simpleAuth";
import { insertLinkSchema, updateLinkSchema, insertPromoEventSchema, updatePromoEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - choose based on environment variable
  const authProvider = process.env.AUTH_PROVIDER || "replit";
  
  let authMiddleware = isAuthenticated;
  
  if (authProvider === "simple") {
    await setupSimpleAuth(app);
    authMiddleware = simpleIsAuthenticated;
  } else {
    await setupAuth(app);
    authMiddleware = isAuthenticated;
  }

  // Auth routes (handled by auth provider setup above)

  // Public routes
  app.get('/api/links', async (req, res) => {
    try {
      const category = req.query.category as string;
      const links = await storage.getLinks(category);
      res.json(links);
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  app.get('/api/links/promos', async (req, res) => {
    try {
      const promos = await storage.getActivePromos();
      res.json(promos);
    } catch (error) {
      console.error("Error fetching promos:", error);
      res.status(500).json({ message: "Failed to fetch promos" });
    }
  });

  app.post('/api/links/:id/click', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementClickCount(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing click count:", error);
      res.status(500).json({ message: "Failed to increment click count" });
    }
  });

  // Protected admin routes
  app.get('/api/admin/stats', authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getLinkStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post('/api/admin/links', authMiddleware, async (req, res) => {
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const link = await storage.createLink(linkData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid link data", errors: error.errors });
      }
      console.error("Error creating link:", error);
      res.status(500).json({ message: "Failed to create link" });
    }
  });

  app.put('/api/admin/links/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const linkData = updateLinkSchema.parse(req.body);
      const link = await storage.updateLink(id, linkData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid link data", errors: error.errors });
      }
      console.error("Error updating link:", error);
      res.status(500).json({ message: "Failed to update link" });
    }
  });

  app.delete('/api/admin/links/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLink(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "Failed to delete link" });
    }
  });

  // Promo Events routes
  app.get('/api/admin/promo-events', authMiddleware, async (req, res) => {
    try {
      const dateStr = req.query.date as string;
      const date = dateStr ? new Date(dateStr) : undefined;
      const events = await storage.getPromoEvents(date);
      res.json(events);
    } catch (error) {
      console.error("Error fetching promo events:", error);
      res.status(500).json({ message: "Failed to fetch promo events" });
    }
  });

  app.get('/api/admin/promo-events/active', authMiddleware, async (req, res) => {
    try {
      const events = await storage.getActivePromoEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching active promo events:", error);
      res.status(500).json({ message: "Failed to fetch active promo events" });
    }
  });

  app.post('/api/admin/promo-events', authMiddleware, async (req, res) => {
    try {
      const eventData = insertPromoEventSchema.parse(req.body);
      const event = await storage.createPromoEvent(eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error creating promo event:", error);
      res.status(500).json({ message: "Failed to create promo event" });
    }
  });

  app.put('/api/admin/promo-events/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = updatePromoEventSchema.parse(req.body);
      const event = await storage.updatePromoEvent(id, eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error updating promo event:", error);
      res.status(500).json({ message: "Failed to update promo event" });
    }
  });

  app.delete('/api/admin/promo-events/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromoEvent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting promo event:", error);
      res.status(500).json({ message: "Failed to delete promo event" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
