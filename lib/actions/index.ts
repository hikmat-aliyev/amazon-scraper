"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from "@/types";
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation'

export async function scrapeAndStoreProduct(productUrl:string) {
  if(!productUrl) return

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;
    
    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url })

    if(existingProduct) {
      const updatedPriceHistory:any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory)
      }
    }

    //update product if it exists, otherwise, create new one
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url }, 
      product,
      { upsert: true, new: true } 
    )
    return `/products/${newProduct._id}`;
    
  } catch (error:any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId })

    if(!product) return null;

    return product;
  } catch (error) {
    
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    noStore();
    const products = await Product.find();
    if(!products) {
      return [];
    }
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getOtherProducts(productId: string) {
  try {
    const product = await Product.findById(productId);
    
    if(!product) return null;

    const otherProducts = await Product.find({
      _id: { $ne: productId}
    }).limit(5)

    return otherProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    //check if at least one of emails in users array of product is same as userEmail
    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error)
  }
}
