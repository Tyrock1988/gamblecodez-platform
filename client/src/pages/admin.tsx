import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Plus, ArrowLeft, Eye, Download, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AddLinkModal from "@/components/add-link-modal";
import PromoCalendar from "@/components/promo-calendar";
import SeedDataButton from "@/components/seed-data-button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Link as LinkType } from "@shared/schema";

export default function Admin() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    retry: false,
  });

  const { data: allLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links'],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/links'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    },
  });

  const filteredLinks = allLinks.filter(link => {
    const matchesCategory = categoryFilter === "all" || link.category === categoryFilter;
    const matchesTag = tagFilter === "all" || (link.tags && link.tags.includes(tagFilter));
    const matchesSearch = searchTerm === "" || 
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesTag && matchesSearch;
  });

  const exportLinks = () => {
    // Generate Telegram-formatted HTML
    let telegramText = "**GambleCodez Links**\n\n";
    
    const categories = ['us', 'non-us', 'everywhere', 'faucet', 'socials'];
    const categoryEmojis = {
      'us': '🇺🇸',
      'non-us': '🌐',
      'everywhere': '🌍',
      'faucet': '🚰',
      'socials': '📱'
    };

    categories.forEach(category => {
      const categoryLinks = allLinks.filter(link => link.category === category);
      if (categoryLinks.length > 0) {
        telegramText += `${categoryEmojis[category as keyof typeof categoryEmojis]} **${category.toUpperCase()} LINKS**\n\n`;
        
        categoryLinks.forEach(link => {
          telegramText += `<a href="${link.url}">${link.name}</a>`;
          if (link.tags && link.tags.length > 0) {
            telegramText += ` <b>${link.tags.join(', ')}</b>`;
          }
          if (link.promoText) {
            telegramText += ` 🔥 ${link.promoText}`;
          }
          telegramText += '\n';
        });
        
        telegramText += '\n______\n\n';
      }
    });

    // Copy to clipboard
    navigator.clipboard.writeText(telegramText).then(() => {
      toast({
        title: "Success",
        description: "Telegram-formatted links copied to clipboard!",
      });
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <nav className="neon-border neon-glow-cyan border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="neon-text neon-glow-cyan">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Public
                </Button>
              </Link>
              <h1 className="text-xl font-bold neon-text neon-glow-magenta">🎰 Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => window.location.href = '/');
                }}
                variant="ghost" 
                size="sm"
                className="neon-text neon-glow-orange"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 neon-border neon-glow-cyan">
              <TabsTrigger value="overview" className="neon-text">Overview</TabsTrigger>
              <TabsTrigger value="calendar" className="neon-text">
                <Calendar className="h-4 w-4 mr-2" />
                Promo Calendar
              </TabsTrigger>
              <TabsTrigger value="links" className="neon-text">Link Management</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="neon-border neon-glow-cyan">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-cyan-500/20 neon-glow-cyan">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Links</p>
                    <p className="text-2xl font-bold neon-text neon-glow-cyan">{stats?.totalLinks || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neon-border neon-glow-magenta">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-magenta-500/20 neon-glow-magenta">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Promos</p>
                    <p className="text-2xl font-bold neon-text neon-glow-magenta">{stats?.activePromos || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neon-border neon-glow-yellow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-500/20 neon-glow-yellow">
                    <span className="text-xl">📱</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Social Links</p>
                    <p className="text-2xl font-bold neon-text neon-glow-yellow">{stats?.socialLinks || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neon-border neon-glow-green">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500/20 neon-glow-green">
                    <span className="text-xl">👆</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold neon-text neon-glow-green">{stats?.totalClicks || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Quick Actions */}
              <Card className="neon-border neon-glow-orange">
                <CardHeader>
                  <CardTitle className="neon-text neon-glow-orange">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setShowAddModal(true)}
                      className="neon-border neon-glow-cyan bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Link
                    </Button>
                    <Button 
                      onClick={exportLinks} 
                      className="neon-border neon-glow-green bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export for Telegram
                    </Button>
                    <SeedDataButton />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <PromoCalendar />
            </TabsContent>

            <TabsContent value="links">
          {/* Links Management */}
          <Card className="neon-border neon-glow-cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="neon-text neon-glow-cyan">Link Management</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="neon-border neon-glow-magenta bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Link
                  </Button>
                  <Button 
                    onClick={exportLinks} 
                    className="neon-border neon-glow-green bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export for Telegram
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 neon-border neon-glow-cyan bg-transparent">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="us">US Links</SelectItem>
                    <SelectItem value="non-us">Non-US Links</SelectItem>
                    <SelectItem value="everywhere">Everywhere</SelectItem>
                    <SelectItem value="faucet">Faucet</SelectItem>
                    <SelectItem value="socials">Socials</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-48 neon-border neon-glow-magenta bg-transparent">
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    <SelectItem value="kyc">KYC</SelectItem>
                    <SelectItem value="no-kyc">No KYC</SelectItem>
                    <SelectItem value="vpn">VPN</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 neon-border neon-glow-yellow bg-transparent"
                />
              </div>

              {/* Links Table */}
              <div className="rounded-md neon-border neon-glow-cyan">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Link</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{link.name}</div>
                            <div className="text-sm text-slate-500">{new URL(link.url).hostname}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{link.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {link.tags?.map((tag) => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {link.isPinned && <Badge className="bg-yellow-100 text-yellow-800">Promo</Badge>}
                          {!link.isPinned && <Badge variant="outline">Active</Badge>}
                        </TableCell>
                        <TableCell>{link.clickCount || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(link.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredLinks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          No links found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddLinkModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
