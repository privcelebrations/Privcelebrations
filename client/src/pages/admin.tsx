import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Phone, Mail, Calendar, Users, DollarSign, Clock, MapPin } from "lucide-react";
import type { Booking, Contact } from "@shared/schema";

export default function AdminPage() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
      completed: "outline"
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (bookingsLoading || contactsLoading) {
    return (
      <div className="min-h-screen bg-theatre-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-theatre-gray rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-theatre-gray rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theatre-black text-white">
      <div className="bg-theatre-charcoal border-b border-theatre-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                Admin <span className="text-theatre-gold">Dashboard</span>
              </h1>
              <p className="text-gray-300 mt-2">Manage bookings and customer inquiries</p>
            </div>
            <div className="flex space-x-4">
              <Card className="bg-theatre-gray border-theatre-gold">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-theatre-gold">{bookings.length}</div>
                  <div className="text-sm text-gray-300">Total Bookings</div>
                </CardContent>
              </Card>
              <Card className="bg-theatre-gray border-theatre-gold">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-theatre-gold">{contacts.length}</div>
                  <div className="text-sm text-gray-300">Contacts</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Recent Bookings</h2>
              <Button variant="outline" className="border-theatre-gold text-theatre-gold">
                Export Data
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <Card className="bg-theatre-charcoal border-theatre-gray">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-theatre-gold mx-auto mb-4" />
                    <p className="text-gray-300">No bookings yet</p>
                    <p className="text-gray-500 text-sm mt-2">Bookings will appear here when customers make reservations</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="bg-theatre-charcoal border-theatre-gray hover:border-theatre-gold transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{booking.customerName}</CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                      <CardDescription className="text-gray-400">
                        Booking ID: {booking.id.slice(-8)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-theatre-gold" />
                          <span className="text-gray-300">{booking.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-theatre-gold" />
                          <span className="text-gray-300">{booking.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-theatre-gold" />
                          <span className="text-gray-300">{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-theatre-gold" />
                          <span className="text-gray-300">{booking.bookingTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-theatre-gold" />
                          <span className="text-gray-300">{booking.partySize} guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-theatre-gold" />
                          <span className="text-theatre-gold font-semibold">₹{booking.totalPrice}</span>
                        </div>
                      </div>
                      
                      {booking.specialRequests && (
                        <div className="pt-2">
                          <p className="text-sm text-gray-400 mb-1">Special Requests:</p>
                          <p className="text-sm text-gray-300 bg-theatre-gray p-2 rounded">{booking.specialRequests}</p>
                        </div>
                      )}

                      <Separator className="bg-theatre-gray" />
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'confirmed' })}
                          disabled={updateBookingStatus.isPending}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-theatre-gold text-theatre-gold"
                          onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'pending' })}
                          disabled={updateBookingStatus.isPending}
                        >
                          Pending
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'cancelled' })}
                          disabled={updateBookingStatus.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Contacts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Contact Inquiries</h2>
              <Button variant="outline" className="border-theatre-gold text-theatre-gold">
                Export Contacts
              </Button>
            </div>

            <div className="space-y-4">
              {contacts.length === 0 ? (
                <Card className="bg-theatre-charcoal border-theatre-gray">
                  <CardContent className="p-8 text-center">
                    <Mail className="h-12 w-12 text-theatre-gold mx-auto mb-4" />
                    <p className="text-gray-300">No contact inquiries</p>
                    <p className="text-gray-500 text-sm mt-2">Customer messages will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                contacts.map((contact) => (
                  <Card key={contact.id} className="bg-theatre-charcoal border-theatre-gray hover:border-theatre-gold transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{contact.name}</CardTitle>
                        <Badge variant="secondary">New</Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        {contact.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm bg-theatre-gray p-3 rounded">
                        {contact.message}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="gradient-gold text-theatre-black">
                          Reply via Email
                        </Button>
                        <Button size="sm" variant="outline" className="border-theatre-gold text-theatre-gold">
                          WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
