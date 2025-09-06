import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBookingSchema, type InsertBooking, type Theatre, type Package } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import WhatsAppButton from "@/components/whatsapp-button";

interface BookingFormProps {
  theatres: Theatre[];
  packages: Package[];
}

export default function BookingForm({ theatres, packages }: BookingFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      theatreId: "",
      customerName: "",
      phone: "",
      email: "",
      partySize: 2,
      bookingDate: "",
      bookingTime: "",
      specialRequests: "",
      packageIds: [],
      totalPrice: "0",
      status: "pending"
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Submitted Successfully!",
        description: `Your booking request for ${booking.bookingDate} at ${booking.bookingTime} has been received. We'll contact you soon to confirm.`,
      });
      form.reset();
      setSelectedPackages([]);
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    const bookingData = {
      ...data,
      packageIds: selectedPackages,
      partySize: Number(data.partySize),
    };
    createBookingMutation.mutate(bookingData);
  };

  const handlePackageChange = (packageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages([...selectedPackages, packageId]);
    } else {
      setSelectedPackages(selectedPackages.filter(id => id !== packageId));
    }
  };

  const selectedTheatre = theatres.find(t => t.id === form.watch("theatreId"));
  const selectedPackageTotal = packages
    .filter(p => selectedPackages.includes(p.id))
    .reduce((total, p) => total + parseFloat(p.price), 0);
  const totalPrice = (selectedTheatre ? parseFloat(selectedTheatre.basePrice) : 0) + selectedPackageTotal;

  const generateWhatsAppMessage = () => {
    const formData = form.getValues();
    const theatre = theatres.find(t => t.id === formData.theatreId);
    const selectedPkgs = packages.filter(p => selectedPackages.includes(p.id));
    
    let message = `Hi! I'd like to book a private theatre experience:\n\n`;
    if (theatre) message += `Theatre: ${theatre.name}\n`;
    if (formData.bookingDate) message += `Date: ${formData.bookingDate}\n`;
    if (formData.bookingTime) message += `Time: ${formData.bookingTime}\n`;
    if (formData.partySize) message += `Party Size: ${formData.partySize} guests\n`;
    if (selectedPkgs.length > 0) {
      message += `Packages: ${selectedPkgs.map(p => p.name).join(', ')}\n`;
    }
    if (formData.specialRequests) message += `Special Requests: ${formData.specialRequests}\n`;
    message += `\nEstimated Total: $${totalPrice.toFixed(2)}\n\nPlease help me complete my booking!`;
    
    return message;
  };

  return (
    <div className="bg-theatre-gray rounded-3xl p-8 shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="theatreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Select Theatre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-theatre-black border-theatre-gold text-white">
                        <SelectValue placeholder="Choose your theatre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-theatre-black border-theatre-gold">
                      {theatres.map((theatre) => (
                        <SelectItem key={theatre.id} value={theatre.id} className="text-white">
                          {theatre.name} - ₹{theatre.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Party Size</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-theatre-black border-theatre-gold text-white">
                        <SelectValue placeholder="Number of guests" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-theatre-black border-theatre-gold">
                      {[2, 4, 6, 8, 12, 16, 20].map((size) => (
                        <SelectItem key={size} value={size.toString()} className="text-white">
                          {size} guests
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bookingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-theatre-black border-theatre-gold text-white hover:bg-theatre-gray hover:text-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-theatre-gold" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span className="text-gray-400">Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-theatre-black border-theatre-gold" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"));
                          }
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="bg-theatre-black text-white"
                        classNames={{
                          day_selected: "bg-theatre-gold text-theatre-black hover:bg-theatre-gold hover:text-theatre-black",
                          day_today: "bg-theatre-gray text-theatre-gold",
                          day: "text-white hover:bg-theatre-gray hover:text-white",
                          head_cell: "text-theatre-gold",
                          caption_label: "text-white",
                          nav_button: "text-theatre-gold hover:bg-theatre-gray"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-theatre-black border-theatre-gold text-white">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-theatre-black border-theatre-gold">
                      <SelectItem value="10:00" className="text-white">10:00 AM</SelectItem>
                      <SelectItem value="14:00" className="text-white">2:00 PM</SelectItem>
                      <SelectItem value="18:00" className="text-white">6:00 PM</SelectItem>
                      <SelectItem value="21:00" className="text-white">9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Your Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      className="w-full bg-theatre-black border-theatre-gold text-white placeholder-gray-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="+91 1234567890" 
                      className="w-full bg-theatre-black border-theatre-gold text-white placeholder-gray-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="w-full bg-theatre-black border-theatre-gold text-white placeholder-gray-400"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {packages.length > 0 && (
            <div>
              <FormLabel className="text-gray-300 mb-4 block">Add-on Packages (Optional)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="flex items-start space-x-3 p-4 bg-theatre-black rounded-xl border border-theatre-gray">
                    <Checkbox
                      id={pkg.id}
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={(checked) => handlePackageChange(pkg.id, checked as boolean)}
                      className="border-theatre-gold data-[state=checked]:bg-theatre-gold data-[state=checked]:text-theatre-black"
                    />
                    <div className="flex-1">
                      <label htmlFor={pkg.id} className="text-sm font-medium text-white cursor-pointer">
                        {pkg.name}
                      </label>
                      <p className="text-xs text-gray-400 mt-1">{pkg.description}</p>
                      <p className="text-theatre-gold font-semibold mt-2">+₹{pkg.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Special Requests</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4} 
                    placeholder="Any special decorations, catering preferences, or accessibility needs?" 
                    className="w-full bg-theatre-black border-theatre-gold text-white placeholder-gray-400 resize-none"
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {totalPrice > 0 && (
            <div className="bg-theatre-black p-4 rounded-xl border border-theatre-gold">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Estimated Total:</span>
                <span className="text-theatre-gold text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
              </div>
              {selectedPackages.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  <div>Base Price: ₹{selectedTheatre?.basePrice || "0"}</div>
                  <div>Add-ons: ₹{selectedPackageTotal.toFixed(2)}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 gradient-gold text-theatre-black py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-check mr-2"></i>
                  Submit Booking Request
                </>
              )}
            </Button>
            <WhatsAppButton
              className="border-2 border-theatre-gold text-theatre-gold py-4 px-8 rounded-xl font-semibold text-lg hover:bg-theatre-gold hover:text-theatre-black transition-all"
              message={generateWhatsAppMessage()}
              showText={true}
              customText="WhatsApp Us"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
