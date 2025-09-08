// Centralized currency symbol & formatter for INR
export const CURRENCY_SYMBOL = "₹";

// Use for neatly formatted INR (e.g., ₹12,34,567.00)
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
