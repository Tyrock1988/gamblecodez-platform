import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">🎰 GambleCodez</h1>
            </div>
            <div className="flex items-center">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🎰</div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Welcome to GambleCodez
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Your ultimate destination for referral links, promos, and gaming connections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🇺🇸</div>
                <div className="text-sm font-medium text-slate-700">US & Non-US</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-sm font-medium text-slate-700">Everywhere</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-sm font-medium text-slate-700">Promos</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-medium text-slate-700">Socials</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              Please login to access the full referral link management system
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
