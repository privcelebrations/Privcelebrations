# Booking Access Guide - Priv Admin Dashboard

## 🎯 Quick Answer: How to Access Customer Bookings

After customers submit booking forms, you can access and manage all bookings through:

### 1. **Admin Dashboard** (Recommended)
- **URL**: `https://privcelebrations.com/admin`
- **Features**: Visual booking management, status updates, customer details
- **Access**: Navigate to `/admin` in your browser

### 2. **API Endpoints** (Developer Access)
- **All Bookings**: `GET /api/bookings`
- **Single Booking**: `GET /api/bookings/{id}`
- **Update Status**: `PATCH /api/bookings/{id}/status`

---

## 🎪 Admin Dashboard Features

### Booking Management
✅ **View All Bookings** - Complete list with customer details  
✅ **Booking Status Updates** - Confirm, pending, cancel, complete  
✅ **Customer Information** - Name, phone, email, special requests  
✅ **Event Details** - Date, time, guest count, theatre selection  
✅ **Package Information** - Selected add-ons and total pricing  
✅ **Real-time Updates** - Instant status changes and notifications  

### Customer Inquiries
✅ **Contact Form Messages** - Direct customer communications  
✅ **WhatsApp Integration** - Quick response buttons  
✅ **Export Functions** - Download booking and contact data  

---

## 📊 Booking Information Available

### Customer Details
- **Name**: Full customer name
- **Contact**: Phone number and email address
- **Communication**: WhatsApp direct link for instant contact

### Event Specifications
- **Theatre**: Selected private theatre room
- **Date & Time**: Scheduled booking date and preferred time
- **Party Size**: Number of guests attending
- **Packages**: Selected add-on services and catering
- **Special Requests**: Custom requirements and preferences
- **Total Price**: Complete pricing including all services

### Booking Status Options
- **Pending**: New booking awaiting confirmation
- **Confirmed**: Approved and scheduled booking
- **Cancelled**: Cancelled by customer or management
- **Completed**: Event successfully concluded

---

## 🚀 Access Methods

### Method 1: Web Dashboard (Primary)
1. Open browser and navigate to: `https://privcelebrations.com/admin`
2. View real-time booking dashboard
3. Click on individual bookings for detailed information
4. Use action buttons to update booking status
5. Export data for record keeping

### Method 2: Direct API Access (Technical)
```bash
# Get all bookings
curl https://privcelebrations.com/api/bookings

# Get specific booking
curl https://privcelebrations.com/api/bookings/{booking-id}

# Update booking status
curl -X PATCH https://privcelebrations.com/api/bookings/{booking-id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

### Method 3: Database Access (Advanced)
- **Development**: Data stored in memory (resets on restart)
- **Production**: PostgreSQL database with persistent storage
- **Migration**: Easy upgrade path from memory to database storage

---

## 📱 Mobile-Friendly Access

The admin dashboard is fully responsive and optimized for:
- **Desktop**: Full feature access with detailed views
- **Tablet**: Touch-friendly interface with sidebar navigation
- **Mobile**: Compact layout with essential booking information

---

## 🔒 Security & Access Control

### Current Setup
- **Open Access**: Admin dashboard currently accessible to all users
- **Development Mode**: No authentication required for testing

### Production Recommendations
- **Authentication**: Implement admin login system
- **Role-Based Access**: Different permission levels for staff
- **Secure URLs**: Protected admin routes with authentication
- **Audit Logging**: Track all booking status changes

---

## 📈 Data Export & Reporting

### Available Export Options
- **Booking Data**: Customer details, dates, pricing
- **Contact Inquiries**: Customer messages and communication
- **Revenue Reports**: Financial summaries and analytics
- **Custom Filters**: Date ranges, status filters, theatre types

### Export Formats
- **CSV**: Spreadsheet-compatible data export
- **JSON**: API-friendly structured data
- **PDF**: Print-ready booking confirmations

---

## 🎯 Immediate Action Steps

1. **Access Dashboard**: Go to `https://privcelebrations.com/admin`
2. **Test Booking**: Create a test booking to see data flow
3. **Update Status**: Practice changing booking statuses
4. **Customer Contact**: Test WhatsApp integration links
5. **Export Data**: Try export functions for record keeping

---

## 🔧 Technical Integration

### Webhook Support (Future)
- **Booking Created**: Automatic notifications
- **Status Changed**: Real-time updates
- **Payment Confirmed**: Integration with payment systems

### Third-Party Integrations
- **Calendar Systems**: Google Calendar, Outlook sync
- **CRM Integration**: Customer relationship management
- **Email Marketing**: Automated follow-up campaigns
- **Analytics**: Booking patterns and customer insights

---

## 📞 Support & Assistance

For technical support or booking management questions:
- **WhatsApp**: +1 8297642050
- **Website**: https://privcelebrations.com
- **Admin Dashboard**: https://privcelebrations.com/admin

---

*Last Updated: January 2025 | CinePrivé by PrivCelebrations.com*