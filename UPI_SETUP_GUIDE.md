# UPI Payment Setup Guide

## Quick Setup

Your ticket system now supports simple UPI payments without needing payment gateways! Here's how to set it up:

### 1. Set Your UPI ID

Add these environment variables to your `.env.local` file:

```bash
# UPI Payment Configuration
NEXT_PUBLIC_UPI_ID=your-upi-id@bank
NEXT_PUBLIC_PAYEE_NAME=Your Business Name
```

Replace:
- `your-upi-id@bank` with your actual UPI ID (e.g., `rushi@paytm`, `john@ybl`, etc.)
- `Your Business Name` with your business/event organizer name

### 2. How It Works

1. **Customer clicks "Pay with UPI"** → Generates UPI deep link
2. **UPI app opens** → Customer completes payment
3. **Customer contacts organizer** → Provides payment screenshot
4. **Organizer verifies payment** → Manually creates ticket via admin panel

### 3. Features

- ✅ **UPI Deep Links**: `upi://pay?pa=your-id@bank&pn=Name&am=750&cu=INR&tn=Event Ticket`
- ✅ **QR Code Support**: Scan with any UPI app
- ✅ **Multiple UPI Apps**: GPay, PhonePe, Paytm, BHIM, etc.
- ✅ **Admin Verification**: Manual payment verification system
- ✅ **Automatic Ticket Generation**: After payment verification

### 4. Admin Workflow

1. Go to your event's seller dashboard
2. Look for "UPI Payment Verification" section
3. See pending payments from customers
4. Verify payment in your bank/UPI app
5. Click "Create Ticket" to generate ticket
6. Customer receives their ticket

### 5. Customer Experience

1. Customer selects tickets and clicks "Pay with UPI"
2. UPI deep link opens their preferred UPI app
3. Payment details are pre-filled
4. Customer completes payment
5. Customer takes screenshot and contacts organizer
6. Organizer verifies and creates ticket

### 6. Benefits

- **No Gateway Fees**: Direct UPI payments
- **No Setup Required**: Just need a UPI ID
- **Instant Settlement**: Money goes directly to your bank
- **Universal Support**: Works with all UPI apps
- **Simple Process**: No complex integrations

### 7. Security Notes

- Always verify payments manually
- Ask for payment screenshots
- Keep records of all transactions
- Only create tickets after confirming payment receipt

### 8. Example UPI Deep Link

```
upi://pay?pa=rushi@paytm&pn=Rushi%20Tickets&am=750&cu=INR&tn=Navratri%20Booking
```

This will open any UPI app with:
- Payee: rushi@paytm
- Amount: ₹750
- Note: Navratri Booking
- Currency: INR

### 9. QR Code

The same UPI link can be encoded in a QR code for customers to scan. Install `qrcode.js` for real QR generation:

```bash
npm install qrcode
npm install @types/qrcode
```

### 10. Testing

1. Set your UPI ID in environment variables
2. Create a test event
3. Try the payment flow
4. Verify the UPI deep link works
5. Test the admin verification system

That's it! You now have a simple, fee-free UPI payment system for your ticket platform.
