import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Link } from "@shared/schema";

interface CopyButtonProps {
  links: Link[];
  category: string;
}

export default function CopyButton({ links, category }: CopyButtonProps) {
  const { toast } = useToast();

  const generateTelegramText = () => {
    let telegramText = '';

    if (category === 'promos') {
      // Promos with separators
      links.forEach((link, index) => {
        telegramText += `<a href="${link.url}">${link.name}</a>`;
        if (link.tags && link.tags.length > 0) {
          telegramText += ` <b>${link.tags.join(', ').toUpperCase()}</b>`;
        }
        if (link.promoText) {
          telegramText += ` 🔥 ${link.promoText}`;
        }
        telegramText += '\n';
        
        if (index < links.length - 1) {
          telegramText += '______\n';
        }
      });
    } else if (category === 'socials') {
      // Socials with separators
      links.forEach((link, index) => {
        telegramText += `<a href="${link.url}">${link.name}</a>\n`;
        if (index < links.length - 1) {
          telegramText += '______\n';
        }
      });
      telegramText += '______\n';
      telegramText += 'Join us everywhere for epic giveaways and high-roller vibes! 🐋💸';
    } else {
      // Regular links
      links.forEach((link) => {
        telegramText += `<a href="${link.url}">${link.name}</a>`;
        if (link.tags && link.tags.length > 0) {
          telegramText += ` <b>${link.tags.join(', ').toUpperCase()}</b>`;
        }
        telegramText += '\n';
      });
    }

    return telegramText;
  };

  const handleCopy = async () => {
    const telegramText = generateTelegramText();
    
    try {
      await navigator.clipboard.writeText(telegramText);
      toast({
        title: "Success",
        description: "Copied to clipboard for Telegram!",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = telegramText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Success",
        description: "Copied to clipboard for Telegram!",
      });
    }
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <Button onClick={handleCopy} className="bg-primary text-white hover:bg-blue-600">
      <Copy className="h-4 w-4 mr-2" />
      Copy for Telegram
    </Button>
  );
}
