export const calculateDiscountedPrice = (priceStr: string, discountStr?: string): number => {
  const price = parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
  if (!discountStr || !price) return price;

  const discountVal = parseInt(discountStr.replace(/[^\d]/g, ''), 10) || 0;
  if (!discountVal) return price;

  if (discountStr.includes('%')) {
    return price - Math.round(price * (discountVal / 100));
  } else {
    return Math.max(0, price - discountVal);
  }
};
