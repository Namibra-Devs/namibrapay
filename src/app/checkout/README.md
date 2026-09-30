# NamibraPay Checkout

A beautiful, mobile-first checkout experience for NamibraPay payments.

## Features

### 🎨 Design
- Clean, minimal interface inspired by Paystack
- Mobile-first responsive design
- Smooth animations and transitions
- NamibraPay brand colors and styling

### 💳 Payment Methods
1. **Mobile Money**
   - MTN Mobile Money
   - Vodafone Cash
   - AirtelTigo Money
   - Phone number validation
   - Provider selection with logos

2. **Card Payment**
   - Visa, Mastercard, Verve support
   - Auto card type detection
   - Formatted card number (spaces every 4 digits)
   - MM/YY expiry format
   - CVV validation
   - Cardholder name

3. **Bank Transfer**
   - Major Ghanaian banks
   - Secure bank redirect flow
   - Real-time bank authentication

### ✨ User Experience
- Tab-based payment method selection
- Real-time input formatting
- Inline validation
- Clear error messages
- Loading states during processing
- Success confirmation screen
- Payment receipt details

### 🔒 Security
- SSL encryption badge
- "Secured by NamibraPay" branding
- Transaction reference display
- Secure input handling

## Usage

### Demo Page
Visit `/checkout/demo` to test the checkout with custom parameters:
- Configure merchant name
- Set payment amount
- Add description
- Launch checkout

### Production Integration

```typescript
// 1. Create payment session on your backend
const session = await createPaymentSession({
  merchantId: "m123",
  amount: 150.00,
  currency: "GHS",
  description: "Order #1234",
  callbackUrl: "https://yoursite.com/payment/callback",
});

// 2. Redirect user to checkout
window.location.href = `/checkout?session=${session.id}`;

// 3. Handle callback
// User will be redirected to your callbackUrl with payment status
```

## File Structure

```
src/app/checkout/
├── page.tsx          # Main checkout page
├── demo/
│   └── page.tsx      # Demo/testing page
├── layout.tsx        # Checkout-specific layout
└── README.md         # This file
```

## Customization

### Merchant Info
In production, merchant details come from the payment session API:
- Merchant logo
- Merchant name
- Contact email

### Payment Amount
Amount is passed via payment session and displayed prominently.

### Styling
Uses NamibraPay brand colors:
- Primary: `brand-teal` (#1a7a5e)
- Gradients and shadows for depth
- Consistent with dashboard design

## Mobile Optimization

- Touch-friendly buttons (min 44px)
- Large form inputs
- Proper keyboard types (tel, number, text)
- Responsive font sizes
- Optimized for small screens

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Test Cards

For testing card payments:
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **Verve**: 5061 0123 4567 8901

Any future expiry (MM/YY) and 3-digit CVV will work in test mode.

## Next Steps

1. ✅ Basic checkout UI
2. ✅ Payment method selection
3. ✅ Form validation
4. ✅ Success screen
5. [ ] API integration
6. [ ] Webhook handling
7. [ ] Payment status polling
8. [ ] Receipt generation
9. [ ] Email notifications
10. [ ] Analytics tracking
