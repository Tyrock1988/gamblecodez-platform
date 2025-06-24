import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Link } from "@shared/schema";

interface LinkCardProps {
  link: Link;
  showFullPromo?: boolean;
  socialStyle?: boolean;
}

export default function LinkCard({ link, showFullPromo = false, socialStyle = false }: LinkCardProps) {
  const clickMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/links/${link.id}/click`);
    },
  });

  const handleClick = () => {
    clickMutation.mutate();
    window.open(link.url, '_blank');
  };

  const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'kyc':
        return 'destructive';
      case 'no-kyc':
        return 'default';
      case 'vpn':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSocialIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('telegram')) return '📱';
    if (lowerName.includes('twitter') || lowerName.includes('x')) return '🐦';
    if (lowerName.includes('discord')) return '💬';
    if (lowerName.includes('instagram')) return '📸';
    if (lowerName.includes('reddit')) return '📋';
    if (lowerName.includes('youtube')) return '📺';
    return '🔗';
  };

  if (socialStyle) {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{getSocialIcon(link.name)}</div>
            <div>
              <div className="font-medium text-slate-800">{link.name}</div>
              <div className="text-sm text-slate-600">{new URL(link.url).hostname}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClick}
            className="text-blue-600 font-medium hover:underline flex items-center"
          >
            {link.name}
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
          {link.tags && link.tags.map((tag) => (
            <Badge key={tag} variant={getTagVariant(tag)} className="text-xs">
              {tag.toUpperCase()}
            </Badge>
          ))}
          {link.isPinned && (
            <Badge className="bg-yellow-100 text-yellow-700 text-xs">🔥 PROMO</Badge>
          )}
        </div>
        {showFullPromo && link.promoText && (
          <div className="mt-2 text-sm text-slate-600">
            <div dangerouslySetInnerHTML={{ __html: link.promoText }} />
          </div>
        )}
      </div>
    </div>
  );
}
