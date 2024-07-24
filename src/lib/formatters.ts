const CURRENCY_FROMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FROMATTER.format(amount);
}

const NUMBER_FROMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
  return NUMBER_FROMATTER.format(number);
}

export function formatDate(createdAt: Date) {
  const date = new Date(createdAt).toLocaleDateString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return date;
  // "Friday, Jul 2, 2021"
}
