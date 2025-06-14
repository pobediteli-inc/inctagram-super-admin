import { CurrencyType, PaymentMethod, SubscriptionType } from "graphql/generated";

export const getCurrencySymbol = (currency: CurrencyType): string => {
  switch (currency) {
    case CurrencyType.Usd:
      return "$";
    case CurrencyType.Eur:
      return "€";
    default:
      throw new Error(`Unsupported currency type: ${currency}`);
  }
};

export const getPaymentMethodDisplayName = (paymentMethod: PaymentMethod): string => {
  switch (paymentMethod) {
    case PaymentMethod.CreditCard:
      return "Credit Card";
    case PaymentMethod.Paypal:
      return "PayPal";
    case PaymentMethod.Stripe:
      return "Stripe";
    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }
};

export const getSubscriptionDuration = (subscriptionType: SubscriptionType): string => {
  switch (subscriptionType) {
    case SubscriptionType.Day:
      return "1 Day";
    case SubscriptionType.Weekly:
      return "7 Days";
    case SubscriptionType.Monthly:
      return "1 Month";
    default:
      throw new Error(`Unsupported subscription type: ${subscriptionType}`);
  }
};
