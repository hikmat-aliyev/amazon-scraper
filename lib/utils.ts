export function extractPrice(...elements: any) {
  for(const element of elements) {
    console.log(element.html())
    const priceText = element.first().text().trim();
    console.log(priceText)
    if(priceText) return priceText.replace(/[^\d.,]/g, '');
  }
  return '';
}