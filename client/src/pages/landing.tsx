import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="neon-border neon-glow-cyan border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold neon-text neon-glow-magenta">🎰 GambleCodez</h1>
            </div>
            <div className="flex items-center">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="neon-border neon-glow-cyan bg-transparent"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-2xl neon-border neon-glow-magenta bg-transparent backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6 neon-text neon-glow-yellow">🎰</div>
            <h1 className="text-4xl font-bold neon-text neon-glow-cyan mb-4">
              Welcome to GambleCodez
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your ultimate destination for referral links, promos, and gaming connections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 neon-border neon-glow-cyan rounded-lg bg-transparent">
                <div className="text-2xl mb-2 neon-text neon-glow-cyan">🇺🇸</div>
                <div className="text-sm font-medium neon-text">US & Non-US</div>
              </div>
              <div className="p-4 neon-border neon-glow-green rounded-lg bg-transparent">
                <div className="text-2xl mb-2 neon-text neon-glow-green">🌍</div>
                <div className="text-sm font-medium neon-text">Everywhere</div>
              </div>
              <div className="p-4 neon-border neon-glow-yellow rounded-lg bg-transparent">
                <div className="text-2xl mb-2 neon-text neon-glow-yellow">🔥</div>
                <div className="text-sm font-medium neon-text">Promos</div>
              </div>
              <div className="p-4 neon-border neon-glow-magenta rounded-lg bg-transparent">
                <div className="text-2xl mb-2 neon-text neon-glow-magenta">📱</div>
                <div className="text-sm font-medium neon-text">Socials</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Please login to access the full referral link management system
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
