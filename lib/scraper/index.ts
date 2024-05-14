"use server"

import axios from "axios";
import * as cheerio from 'cheerio';
import { extractPrice } from "../utils";

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
    const currentPrice = extractPrice(
      $('span.a-price.a-text-price.a-size-medium.apexPriceToPay').find('span.a-offscreen').first()
    );
   
    const originalPrice = extractPrice(
      $('.a-span12.a-color-secondary.a-size-base')
      .find('span.a-price.a-text-price.a-size-base')
      .find('span.a-offscreen').first()
    )

    console.log({title, currentPrice, originalPrice})
  } catch (error:any) {
    throw new Error(`Failed to scrape product: ${error.message}`)
  }
}