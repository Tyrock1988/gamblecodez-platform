const [{ totalLinks, activePromos, socialLinks, totalClicks }] = await db
  .select({
    totalLinks: sql`COUNT(*) FILTER (WHERE ${links.isActive} = true)`,
    activePromos: sql`COUNT(*) FILTER (WHERE ${links.isPinned} = true AND ${links.isActive} = true)`,
    socialLinks: sql`COUNT(*) FILTER (WHERE ${links.category} = 'socials' AND ${links.isActive} = true)`,
    totalClicks: sql`SUM(${links.clickCount}) FILTER (WHERE ${links.isActive} = true)`,
  })
  .from(links);
