export interface ProductPrice {
  productId: number;
  periodInDays: number;
  periodInMonths: number;
  currency: "PLN";
  fullPrice: number;
  savings: number;
  topOffer: boolean;
}

export const PRICES: ProductPrice[] = [
  {
    productId: 1,
    periodInDays: 31,
    periodInMonths: 1,
    currency: "PLN",
    fullPrice: 30,
    savings: 0,
    topOffer: false,
  },
  {
    productId: 2,
    periodInDays: 365,
    periodInMonths: 12,
    currency: "PLN",
    fullPrice: 240,
    savings: 120,
    topOffer: true,
  },
  {
    productId: 3,
    periodInDays: 181,
    periodInMonths: 6,
    currency: "PLN",
    fullPrice: 150,
    savings: 30,
    topOffer: false,
  },
];
