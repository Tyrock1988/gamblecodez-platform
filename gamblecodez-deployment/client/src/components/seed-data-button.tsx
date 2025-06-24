import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const referralLinks = [
  // US Links
  { name: "GetZoot", url: "https://getzoot.us/?referralCode=ZOOTwithGAMBACODEZ", category: "us", tags: ["kyc"], isPinned: true, promoText: "🔥 3 Free SC + $2.99 for 5 SC! Join & request Zoot Guild in GambleCodez for bonus drops!" },
  { name: "Bitsler.io", url: "https://www.bitsler.io/?ref=GambaCodez", category: "us", tags: ["kyc"], isPinned: true, promoText: "🔥 <b>Bitsler.io Promo</b> 🎰 <b>Free Daily SC!</b> 💰 <b>EXCLUSIVE DEAL:</b> Purchase a Gold Coins Pack and get <b>15 FREE SC</b> for just <b>$4.99</b>!" },
  { name: "ChipnWin", url: "https://chipnwin.com/?earn=rxGdtRPO", category: "us", tags: ["kyc"] },
  { name: "SpeedSweeps", url: "https://speedsweeps.com/?ref=r_gamblecodez", category: "us", tags: ["kyc"] },
  { name: "FishTables.io", url: "https://fishtables.io/pre-register?ref=zpvfkfmea5", category: "us", tags: ["no-kyc"] },
  { name: "LoneStar Casino", url: "https://lonestarcasino.com/refer/529838", category: "us", tags: ["kyc"] },
  { name: "Wow Vegas", url: "https://www.wowvegas.com/?raf=1060914", category: "us", tags: ["kyc"] },
  { name: "RealPrize", url: "https://realprize.com/refer/218415", category: "us", tags: ["kyc"] },
  { name: "Crown Coins", url: "https://crowncoinscasino.com/?utm_campaign=636b19e0-e93c-4e37-81c0-e87267e06791&utm_source=friends", category: "us", tags: ["kyc"] },
  { name: "LuckySlots", url: "https://luckyslots.us?raf=VENxVEFDSVpqUnNFNGhDOG1rT0M=", category: "us", tags: ["kyc"] },
  { name: "High5 Casino", url: "https://high5casino.com/gc?adId=INV001%3Athetylo88", category: "us", tags: ["kyc"] },
  { name: "Funrize", url: "https://funrize.com/?invited_by=FRX074", category: "us", tags: ["kyc"] },
  { name: "Jackpot Rabbit", url: "https://jackpotrabbit.com/?invited_by=IY7IL9", category: "us", tags: ["kyc"] },
  { name: "Chanced", url: "https://chanced.com/c/ev1h43", category: "us", tags: ["kyc"] },
  { name: "Punt", url: "https://punt.com/c/857fdb", category: "us", tags: ["kyc"] },
  { name: "Legendz", url: "https://www.legendz.com/?referred_by_id=19277", category: "us", tags: ["kyc"] },
  { name: "JacksClub", url: "https://jacksclub.io?r=gamblecodez", category: "us", tags: ["no-kyc"] },
  { name: "LunaLand", url: "https://lunalandcasino.com/?inviter=39a8aa0f-711b-5eb9-9b53-27de2bceb202&utm_source=referral&utm_medium=inviteafriend", category: "us", tags: ["kyc"] },
  { name: "GoldNLuck", url: "https://www.goldnluck.com?referralcode=f25ec51b-e8ac-4e13-9b25-3cc3831ee3f8", category: "us", tags: ["kyc"] },
  { name: "LuckyHands", url: "https://luckyhands.com/sign-up?code=f629897b-5cb0-4429-9e28-54ac31fe559a", category: "us", tags: ["kyc"] },
  { name: "Vivaro", url: "https://vivaro.us/en-us/?action=register&reference_code=uG7OReLS76J5M76A", category: "us", tags: ["kyc"] },
  { name: "MyPrize", url: "https://myprize.us/invite/GambleCodez", category: "us", tags: ["kyc"] },
  { name: "SweepNext", url: "https://sweepnext.com/?c=1698_QBJtf29K", category: "us", tags: ["kyc"] },
  { name: "StarBets", url: "https://starbets.io/?ref=Xr6ZCPKYRk", category: "us", tags: ["no-kyc"] },

  // Non-US Links
  { name: "Winna", url: "https://winna.com/?referral=GAMBLECODEZ", category: "non-us", tags: ["vpn", "no-kyc"], isPinned: true, promoText: "🚨 <b>WINNA.COM - VIP BONUS</b> 💸 🎰 Grinding VIP on <b>WINNA.COM</b>? Every time you level up — <b>any tier up to VIP Nebula 1</b> — 💸 <b>I'll TIP YOU 20% of my affiliate bonus</b> as a thank you!" },
  { name: "Playing.io", url: "https://playing.io/?promoCode=08vohv1e", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Shuffle", url: "https://shuffle.com?r=GambleCodez", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Goated", url: "https://www.goated.com/r/GAMBLECODEZ", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Roobet", url: "https://roobet.com/?ref=gambacodez", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "SBX", url: "https://sbx.com/sign-up?r=GAMBLECODEZ", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Stake.com", url: "https://stake.com/?c=GambleCodez", category: "non-us", tags: ["vpn", "kyc"] },
  { name: "JungleBet (30% Commission)", url: "https://junglebet.com/r/GambleCodez30", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "JungleBet", url: "https://junglebet.com/r/GambleCodez", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Blackjack.Fun", url: "https://blackjack.fun/bonus/44b0a8dc-5985-4ea4-a623-722234948892", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Rakebit", url: "https://rakebit.com?trtag=20154_68456f699127c", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "IzzyBet (Web)", url: "https://izzybet.com/en?aff=b2c1021-1001906_0", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "IzzyBet (Bot)", url: "https://t.me/izzybetcom_bot?start=aff_b2c1021-1001906_0", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "Solpot", url: "https://solpot.com/r/Freebie", category: "non-us", tags: ["vpn", "no-kyc"] },
  { name: "500.Casino", url: "https://500.casino/r/GAMBLECODEZ", category: "non-us", tags: ["no-kyc"] },
  { name: "Pasino", url: "https://pasino.com/?user_id=911768", category: "non-us", tags: ["no-kyc"] },

  // Everywhere Links
  { name: "RuneHall", url: "https://runehall.com/a/GambleCodez", category: "everywhere", tags: ["no-kyc"] },
  { name: "Jackpotter", url: "https://jackpotter.com?r=gamblecodez", category: "everywhere", tags: ["no-kyc"] },
  { name: "RuneWager", url: "https://runewager.com/r/GambleCodez", category: "everywhere", tags: ["no-kyc"] },
  { name: "JacksClub", url: "https://jacksclub.io?r=gamblecodez", category: "everywhere", tags: ["no-kyc"] },
  { name: "MetaWin", url: "https://metawin.com/gamblecodez/", category: "everywhere", tags: ["vpn", "no-kyc"] },
  { name: "OhPlay.Club", url: "https://ohplay.club/?ref=GambleCodez", category: "everywhere", tags: ["no-kyc"] },
  { name: "RillaBox", url: "https://rillabox.com/ref/tyler303Join", category: "everywhere", tags: ["no-kyc"] },
  { name: "Cases.gg", url: "https://cases.gg/r/GAMBLECODEZ", category: "everywhere", tags: ["no-kyc"] },
  { name: "StarBets", url: "https://starbets.io/?ref=Xr6ZCPKYRk", category: "everywhere", tags: ["no-kyc"] },

  // Faucet Links
  { name: "BCH.GAMES", url: "https://bch.games/play/GambleCodez", category: "faucet", tags: ["vpn", "no-kyc"] },
  { name: "Nuts.gg", url: "https://nuts.gg/play/GambleCodez", category: "faucet", tags: ["vpn", "no-kyc"] },
  { name: "LuckyBird", url: "https://luckybird.io/?c=gamblecodez", category: "faucet", tags: ["kyc"] },
  { name: "TrustDice", url: "https://trustdice.win/faucet/?ref=u_thetylo1988", category: "faucet", tags: ["no-kyc"] },

  // Social Links
  { name: "Telegram (PrizeHub)", url: "https://t.me/GambleCodezPrizeHub", category: "socials", tags: [] },
  { name: "Telegram (Drops)", url: "https://t.me/GambleCodezDrops", category: "socials", tags: [] },
  { name: "X", url: "https://x.com/GambleCodez", category: "socials", tags: [] },
  { name: "Twitter Community", url: "https://twitter.com/i/communities/1916758821394944306", category: "socials", tags: [] },
  { name: "Instagram", url: "https://www.instagram.com/gamblecodez", category: "socials", tags: [] },
  { name: "Reddit", url: "https://www.reddit.com/r/GambleCodez", category: "socials", tags: [] },
  { name: "Discord", url: "https://discord.gg/7fcr69AHxt", category: "socials", tags: [] }
];

export default function SeedDataButton() {
  const { toast } = useToast();
  const [seededCount, setSeededCount] = useState(0);

  const seedMutation = useMutation({
    mutationFn: async () => {
      let count = 0;
      for (const link of referralLinks) {
        await apiRequest('POST', '/api/admin/links', {
          name: link.name,
          url: link.url,
          category: link.category,
          tags: link.tags,
          promoText: link.promoText || null,
          isPinned: link.isPinned || false,
          isActive: true
        });
        count++;
        setSeededCount(count);
      }
      return count;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['/api/links'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Database Seeded Successfully",
        description: `Added ${count} referral links with proper categories and GambleCodez affiliate URLs`,
      });
      setSeededCount(0);
    },
    onError: (error) => {
      toast({
        title: "Seeding Failed",
        description: "Failed to seed database. Make sure you're logged in.",
        variant: "destructive",
      });
      setSeededCount(0);
    },
  });

  return (
    <Button
      onClick={() => seedMutation.mutate()}
      disabled={seedMutation.isPending}
      className="neon-border neon-glow-yellow bg-transparent"
    >
      {seedMutation.isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Database className="h-4 w-4 mr-2" />
      )}
      {seedMutation.isPending 
        ? `Seeding... (${seededCount}/${referralLinks.length})`
        : "Seed Database with GambleCodez Links"
      }
    </Button>
  );
}