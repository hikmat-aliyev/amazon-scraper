import { PriceHistoryItem, Product } from "@/types";

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const text = element.text()
    const priceText = element.first().text().trim();
    // console.log(priceText)
    if (priceText) {
      // Remove any character that is not a digit or a comma or a dot
      const cleanedText = priceText.replace(/[^\d.,]/g, '');
      // Replace commas with nothing to handle thousand separators
      const normalizedText = cleanedText.replace(/,/g, '');
      // Convert the cleaned string to a number
      const priceNumber = parseFloat(normalizedText);
      if (!isNaN(priceNumber)) {
        return priceNumber;
      }
    }
  }
  return 0;
}

export function extractCurrency(element: any) {
  const currency = element.text().trim().slice(0, 1)
  return currency ? currency : '';
}

export function extractStar(element: any) {
    const match = element.match(/[\d.]+/);
    if (match) {
      return parseFloat(match[0]);
    }
    return null;
}

export function extractReviewCount(...elements: any) {
  for(const element of elements) {
    // Use a regular expression to match and remove non-numeric characters except commas
    const numberString = element.match(/\d{1,3}(,\d{3})*/g)[0];
    // Remove commas to get the final number
    const number = parseInt(numberString.replace(/,/g, ''), 10);
    return number;
    }
  return 0;
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];  

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

export const getEmailNotifyType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};