// Compatibility helper retained from the original architecture.
// Payments now use Stripe Payment Links directly.

export function getStripePaymentLink() {
  return process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";
}
