# 🔧 UPI Configuration Guide

## How to Change Your UPI ID

### **Step 1: Create Environment File**

Create a file called `.env.local` in your project root directory with the following content:

```bash
# UPI Payment Configuration
NEXT_PUBLIC_UPI_ID=your-upi-id@bank
NEXT_PUBLIC_PAYEE_NAME=Your Business Name

# Other required environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
CONVEX_DEPLOYMENT=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_key
```

### **Step 2: Replace with Your UPI ID**

Replace `your-upi-id@bank` with your actual UPI ID. Examples:

```bash
# Examples of valid UPI IDs:
NEXT_PUBLIC_UPI_ID=anirudh@paytm
NEXT_PUBLIC_UPI_ID=rushi@ybl
NEXT_PUBLIC_UPI_ID=john@okaxis
NEXT_PUBLIC_UPI_ID=business@upi
```

### **Step 3: Set Your Business Name**

Replace `Your Business Name` with your actual business name:

```bash
NEXT_PUBLIC_PAYEE_NAME=Anirudh's Event Tickets
NEXT_PUBLIC_PAYEE_NAME=T-System Events
NEXT_PUBLIC_PAYEE_NAME=Your Business Name
```

### **Step 4: Restart Development Server**

After changing the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🚀 **For Production Deployment (Vercel):**

### **Step 1: Add Environment Variables in Vercel**

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_UPI_ID` | `your-upi-id@bank` | Production, Preview, Development |
| `NEXT_PUBLIC_PAYEE_NAME` | `Your Business Name` | Production, Preview, Development |

### **Step 2: Redeploy**

After adding environment variables, redeploy your project:

```bash
# Or trigger a new deployment from Vercel dashboard
```

## 📱 **UPI ID Format Examples:**

### **Valid UPI ID Formats:**
- `username@paytm` (Paytm)
- `username@ybl` (PhonePe)
- `username@okaxis` (Google Pay)
- `username@upi` (BHIM)
- `username@okhdfcbank` (HDFC Bank)
- `username@okicici` (ICICI Bank)
- `username@oksbi` (SBI)

### **Invalid UPI ID Formats:**
- `username@gmail.com` ❌ (Not a UPI ID)
- `username@yahoo.com` ❌ (Not a UPI ID)
- `+91-9876543210` ❌ (Phone number, not UPI ID)

## 🔍 **How to Find Your UPI ID:**

### **Method 1: Check Your UPI App**
1. Open your UPI app (GPay, PhonePe, Paytm, etc.)
2. Look for "UPI ID" or "VPA" (Virtual Payment Address)
3. It usually looks like `username@bankcode`

### **Method 2: Check Bank App**
1. Open your bank's mobile app
2. Go to UPI section
3. Look for your UPI ID or VPA

### **Method 3: Check Previous UPI Transactions**
1. Open any UPI app
2. Go to transaction history
3. Look for your UPI ID in sent payments

## 🧪 **Testing Your UPI ID:**

### **Step 1: Test UPI Deep Link**
Visit your test page: `https://your-domain.com/test-upi`

### **Step 2: Generate Test Link**
The system will generate a UPI deep link like:
```
upi://pay?pa=your-upi-id@bank&pn=Your%20Business&am=750&cu=INR&tn=Test%20Payment
```

### **Step 3: Test on Mobile**
1. Open the link on your phone
2. It should open your UPI app
3. Payment details should be pre-filled
4. Verify the payee shows your UPI ID

## 🚨 **Important Notes:**

### **Security:**
- Never share your UPI PIN with anyone
- Only share your UPI ID (the one ending with @bank)
- UPI ID is safe to share publicly

### **Business:**
- Use a professional UPI ID for business
- Consider creating a dedicated business UPI ID
- Keep your UPI ID consistent across platforms

### **Testing:**
- Test with small amounts first
- Verify payment flow end-to-end
- Check that payments reach your bank account

## 🔄 **Changing UPI ID After Deployment:**

### **For Development:**
1. Update `.env.local` file
2. Restart development server
3. Test the changes

### **For Production:**
1. Update environment variables in Vercel
2. Redeploy the application
3. Test on live site

## 📞 **Support:**

If you need help setting up your UPI ID:
1. Check with your bank for UPI ID format
2. Contact your UPI app support
3. Test with a small amount first

---

**Your UPI ID is currently set to:** `your-upi-id@bank` (placeholder)

**Change it to your actual UPI ID in the environment variables!**
