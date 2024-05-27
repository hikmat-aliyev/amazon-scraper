"use server"

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice, extractReviewCount, extractStar } from "../utils";

export async function scrapeAmazonProduct(url:string) {
  if(!url) return;

  //BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (100000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.op",
    port,
    rejectUnauthorized: false,
  }

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data)
    

    //Extract product info
    const title = $("#productTitle").text().trim();
    const currentPriceWhole = extractPrice(
      $('span.a-price.a-text-price.a-size-medium.apexPriceToPay').find('span.a-offscreen').first(),
      $('span.a-price-whole'), 
      $('span.a-price-fraction'), 
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );

    const currentPriceFraction = extractPrice($('.a-price-fraction'))
     
    const originalPrice = extractPrice(
      $('.a-span12.a-color-secondary.a-size-base')
      .find('span.a-price.a-text-price.a-size-base')
      .find ('span.a-offscreen').first()
    );
     
    let totalCurrentPrice;
    //if the whole price also includes dot, it means it has the fraction part already
    if(!currentPriceWhole.toString().includes('.')){
      totalCurrentPrice = Number(currentPriceWhole + '.' + currentPriceFraction)
    }else {
      totalCurrentPrice = currentPriceWhole
    }

    

    const outOfStock = $('.a-size-medium.a-color-success').text().trim().toLowerCase().includes('out of stock');

    const images = 
      $('#landingImage').attr('data-a-dynamic-image') ||
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      '{}'

    const imgUrls = Object.keys(JSON.parse(images))

    const currency = extractCurrency($('.a-price-symbol'))

    const parentSpan = $('td.a-span12.a-color-price.a-size-base > span:contains("%")').first();

    const discountRate = parentSpan.contents().filter(function() {
        return this.nodeType === 3; // Filter for text nodes
    }).text().trim().replace(/[()]/g, ''); // Remove parentheses

    const discountRateNumber = parseInt((discountRate.replace('%', '')), 10);

    const description = $('#feature-bullets span.a-list-item').text();
    const star = extractStar($('span.a-size-base.a-color-base').text().trim());
    const reviewsCount = extractReviewCount( $('span[data-hook="total-review-count"]').text());
    //Construct data object with scraped info
    const data = {
      url,
      currency: currency || '$',
      image: imgUrls[0],
      title,
      currentPrice: totalCurrentPrice || originalPrice,
      originalPrice: originalPrice || totalCurrentPrice,
      priceHistory: [],
      discountRate: discountRateNumber,
      category: 'category',
      reviewsCount: reviewsCount || 100,
      isOutOfStock: outOfStock,
      description,
      star,
      lowestPrice: totalCurrentPrice || originalPrice,
      highestPrice: originalPrice || totalCurrentPrice,
      averagePrice: totalCurrentPrice || originalPrice,
    }
    console.log(data)
    return data
  } catch (error:any) {
    throw new Error(`Failed to scrape product: ${error.message}`)
  }
}