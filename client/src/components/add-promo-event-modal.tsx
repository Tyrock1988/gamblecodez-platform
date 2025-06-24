import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPromoEventSchema } from "@shared/schema";
import type { InsertPromoEvent } from "@shared/schema";

interface AddPromoEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPromoEventModal({ open, onOpenChange }: AddPromoEventModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertPromoEvent>({
    resolver: zodResolver(insertPromoEventSchema),
    defaultValues: {
      title: "",
      description: "",
      promoCode: "",
      casinoName: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Default 48 hours
      isActive: true,
      tags: [],
      affiliateUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPromoEvent) => {
      await apiRequest('POST', '/api/admin/promo-events', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promo-events'] });
      form.reset();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Promo event created successfully! Affiliate link auto-detected if available.",
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
        description: "Failed to create promo event",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPromoEvent) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg neon-border neon-glow-magenta">
        <DialogHeader>
          <DialogTitle className="neon-text neon-glow-magenta">Add New Promo Event</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="casinoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="neon-text">Casino Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., GetZoot, Bitsler, Winna" 
                      className="neon-border neon-glow-cyan bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="neon-text">Event Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Free SC Bonus, VIP Cash Drop"
                      className="neon-border neon-glow-cyan bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promoCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="neon-text">Promo Code (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., GAMBLE50, FREESC"
                      className="neon-border neon-glow-yellow bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="neon-text">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter promo details..." 
                      rows={3}
                      className="neon-border neon-glow-cyan bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="neon-text">Start Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        className="neon-border neon-glow-green bg-transparent"
                        {...field}
                        value={field.value instanceof Date ? 
                          field.value.toISOString().slice(0, 16) : field.value}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="neon-text">End Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        className="neon-border neon-glow-orange bg-transparent"
                        {...field}
                        value={field.value instanceof Date ? 
                          field.value.toISOString().slice(0, 16) : field.value}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="affiliateUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="neon-text">Affiliate URL (Auto-detected)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Will auto-populate from existing links"
                      className="neon-border neon-glow-blue bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="neon-border neon-glow-cyan bg-transparent"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="neon-border neon-glow-magenta bg-transparent"
              >
                {createMutation.isPending ? "Creating..." : "Add Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}