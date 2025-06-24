import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Copy, Clock, ExternalLink } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import AddPromoEventModal from "./add-promo-event-modal";
import type { PromoEvent } from "@shared/schema";

export default function PromoCalendar() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: events = [] } = useQuery<PromoEvent[]>({
    queryKey: ['/api/admin/promo-events', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => 
      fetch(`/api/admin/promo-events?date=${format(selectedDate, 'yyyy-MM-dd')}`)
        .then(res => res.json()),
    retry: false,
  });

  const { data: activeEvents = [] } = useQuery<PromoEvent[]>({
    queryKey: ['/api/admin/promo-events/active'],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/promo-events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promo-events'] });
      toast({
        title: "Success",
        description: "Promo event deleted successfully",
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
        description: "Failed to delete promo event",
        variant: "destructive",
      });
    },
  });

  const copyTelegramText = (event: PromoEvent) => {
    let telegramText = `🎰 <b>${event.casinoName}</b> - ${event.title}\n\n`;
    
    if (event.promoCode) {
      telegramText += `💎 <b>Promo Code:</b> <code>${event.promoCode}</code>\n`;
    }
    
    if (event.description) {
      telegramText += `📝 ${event.description}\n`;
    }
    
    if (event.affiliateUrl) {
      telegramText += `\n🔗 <a href="${event.affiliateUrl}">Click here to claim</a>\n`;
    }
    
    telegramText += `\n⏰ <b>Valid until:</b> ${format(new Date(event.endDate), 'MMM dd, yyyy HH:mm')}\n`;
    telegramText += `\n🏆 Get your bonus now! Limited time offer!\n`;
    telegramText += `\n______\n`;
    telegramText += `\n📱 Follow GambleCodez for more exclusive deals!`;

    navigator.clipboard.writeText(telegramText).then(() => {
      toast({
        title: "Success",
        description: "Telegram post copied to clipboard!",
      });
    });
  };

  const getEventStatus = (event: PromoEvent) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    if (now < start) return { status: 'upcoming', color: 'neon-glow-blue' };
    if (now > end) return { status: 'expired', color: 'neon-glow-orange' };
    return { status: 'active', color: 'neon-glow-green' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold neon-text neon-glow-cyan">📅 Promo Calendar</h2>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="neon-border neon-glow-magenta bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Promo Event
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="neon-border neon-glow-cyan">
          <CardHeader>
            <CardTitle className="neon-text neon-glow-cyan">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
              modifiers={{
                hasEvents: activeEvents
                  .filter(event => {
                    const eventStart = new Date(event.startDate);
                    const eventEnd = new Date(event.endDate);
                    return selectedDate >= eventStart && selectedDate <= eventEnd;
                  })
                  .map(() => selectedDate)
              }}
              modifiersStyles={{
                hasEvents: {
                  background: 'hsl(300, 100%, 15%)',
                  border: '1px solid var(--neon-magenta)',
                  boxShadow: '0 0 10px var(--neon-magenta)'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card className="neon-border neon-glow-magenta">
          <CardHeader>
            <CardTitle className="neon-text neon-glow-magenta">
              Events for {format(selectedDate, 'MMM dd, yyyy')}
              {isToday(selectedDate) && <Badge className="ml-2 neon-glow-yellow">Today</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No promo events for this date
                </p>
              ) : (
                events.map((event) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <Card key={event.id} className={`neon-border ${eventStatus.color}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold neon-text">{event.casinoName}</h4>
                            <p className="text-sm text-muted-foreground">{event.title}</p>
                          </div>
                          <Badge className={`${eventStatus.color} capitalize`}>
                            {eventStatus.status}
                          </Badge>
                        </div>

                        {event.promoCode && (
                          <div className="mb-2">
                            <Badge className="neon-glow-yellow">
                              Code: {event.promoCode}
                            </Badge>
                          </div>
                        )}

                        {event.description && (
                          <p className="text-sm mb-3 text-muted-foreground">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                          </div>
                          {event.affiliateUrl && (
                            <div className="flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              GambleCodez Link
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => copyTelegramText(event)}
                            className="neon-border neon-glow-cyan bg-transparent flex-1"
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copy for Telegram
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(event.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Promos Summary */}
      <Card className="neon-border neon-glow-green">
        <CardHeader>
          <CardTitle className="neon-text neon-glow-green">🔥 Currently Active Promos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEvents.map((event) => (
              <Card key={event.id} className="neon-border neon-glow-yellow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold neon-text">{event.casinoName}</h4>
                    <Badge className="neon-glow-green">Live</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event.title}</p>
                  {event.promoCode && (
                    <Badge className="neon-glow-yellow mb-2">
                      {event.promoCode}
                    </Badge>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Ends: {format(new Date(event.endDate), 'MMM dd, HH:mm')}
                  </div>
                </CardContent>
              </Card>
            ))}
            {activeEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No active promo events
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddPromoEventModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}