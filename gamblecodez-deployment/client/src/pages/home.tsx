import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Settings, Eye } from "lucide-react";
import LinkCard from "@/components/link-card";
import CopyButton from "@/components/copy-button";
import type { Link as LinkType } from "@shared/schema";

export default function Home() {
  const { data: usLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links?category=us'],
  });

  const { data: nonUsLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links?category=non-us'],
  });

  const { data: everywhereLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links?category=everywhere'],
  });

  const { data: faucetLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links?category=faucet'],
  });

  const { data: socialLinks = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links?category=socials'],
  });

  const { data: promos = [] } = useQuery<LinkType[]>({
    queryKey: ['/api/links/promos'],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="neon-border neon-glow-cyan border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold neon-text neon-glow-magenta">🎰 GambleCodez</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="neon-border neon-glow-cyan bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Public View
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="neon-border neon-glow-magenta bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              <Button 
                onClick={() => window.location.href = '/api/logout'}
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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 neon-text neon-glow-cyan">Welcome to GambleCodez</h2>
          <p className="text-xl text-muted-foreground mb-8">Your ultimate destination for referral links, promos, and gaming connections</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => scrollToSection('us-nonus')}
              className="neon-border neon-glow-cyan bg-transparent"
            >
              🇺🇸 US & Non-US
            </Button>
            <Button 
              onClick={() => scrollToSection('everywhere-faucet')}
              className="neon-border neon-glow-green bg-transparent"
            >
              🌍 Everywhere & Faucet
            </Button>
            <Button 
              onClick={() => scrollToSection('promos')}
              className="neon-border neon-glow-magenta bg-transparent"
            >
              🔥 Promos
            </Button>
            <Button 
              onClick={() => scrollToSection('socials')}
              className="neon-border neon-glow-yellow bg-transparent"
            >
              📱 Socials
            </Button>
          </div>
        </div>
      </div>

      {/* US & Non-US Section */}
      <section id="us-nonus" className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold neon-text neon-glow-cyan">🇺🇸 US & Non-US List</h3>
            <CopyButton links={[...usLinks, ...nonUsLinks]} category="us-nonus" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neon-border neon-glow-cyan">
              <CardHeader>
                <CardTitle className="flex items-center neon-text neon-glow-cyan">
                  <span className="mr-2">🇺🇸</span>
                  US Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                  {usLinks.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No US links available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="neon-border neon-glow-magenta">
              <CardHeader>
                <CardTitle className="flex items-center neon-text neon-glow-magenta">
                  <span className="mr-2">🌐</span>
                  Non-US Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nonUsLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                  {nonUsLinks.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No Non-US links available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Everywhere & Faucet Section */}
      <section id="everywhere-faucet" className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold neon-text neon-glow-green">🌍 Everywhere & Faucet List</h3>
            <CopyButton links={[...everywhereLinks, ...faucetLinks]} category="everywhere-faucet" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neon-border neon-glow-green">
              <CardHeader>
                <CardTitle className="flex items-center neon-text neon-glow-green">
                  <span className="mr-2">🌍</span>
                  Everywhere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {everywhereLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                  {everywhereLinks.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No everywhere links available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="neon-border neon-glow-yellow">
              <CardHeader>
                <CardTitle className="flex items-center neon-text neon-glow-yellow">
                  <span className="mr-2">🚰</span>
                  Faucet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faucetLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                  {faucetLinks.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No faucet links available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section id="promos" className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold neon-text neon-glow-magenta">🔥 Featured Promos</h3>
            <CopyButton links={promos} category="promos" />
          </div>

          <div className="space-y-6">
            {promos.map((promo, index) => (
              <div key={promo.id}>
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <LinkCard link={promo} showFullPromo />
                      </div>
                      <div className="text-2xl">🔥</div>
                    </div>
                    {promo.promoText && (
                      <div className="prose prose-sm max-w-none text-slate-700">
                        <div dangerouslySetInnerHTML={{ __html: promo.promoText }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
                {index < promos.length - 1 && (
                  <div className="text-center py-4">
                    <div className="text-yellow-600 font-bold text-lg">______</div>
                  </div>
                )}
              </div>
            ))}
            {promos.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-500">No promotional links available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Socials Section */}
      <section id="socials" className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold neon-text neon-glow-yellow">📱 Social Links</h3>
            <CopyButton links={socialLinks} category="socials" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {socialLinks.map((social) => (
              <LinkCard key={social.id} link={social} socialStyle />
            ))}
            {socialLinks.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500">No social links available</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-slate-700">
                Join us everywhere for epic giveaways and high-roller vibes! 🐋💸
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
