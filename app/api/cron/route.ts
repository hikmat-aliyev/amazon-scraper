  import { NextResponse } from "next/server";

  import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifyType } from "@/lib/utils";
  import { connectToDB } from "@/lib/mongoose";
  import Product from "@/lib/models/product.model";
  import { scrapeAmazonProduct } from "@/lib/scraper";
  import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

  export const maxDuration = 60; 
  export const dynamic = "force-dynamic";
  export const revalidate = 0;

  export async function GET(request: Request) {
    try {
      connectToDB();

      const products = await Product.find({});

      if (!products) throw new Error("No product fetched");

      // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
      const updatedProducts = await Promise.all(
        products.map(async (currentProduct) => {
          // Scrape product
          const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
          console.log('Scraped Product:', scrapedProduct);

          if (!scrapedProduct || !scrapedProduct.currentPrice) {
            console.error(`Failed to scrape product or price is missing for ${currentProduct.url}`);
            return;
          }

          const updatedPriceHistory = [
            ...(currentProduct.priceHistory || []),
            {
              price: scrapedProduct.currentPrice,
            },
          ];

          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update Products in DB
          const updatedProduct = await Product.findOneAndUpdate(
            {
              url: product.url,
            },
            product
          );

          // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
          const emailNotifyType = getEmailNotifyType(
            scrapedProduct,
            currentProduct
          );

          if (emailNotifyType && updatedProduct.users.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
            };
            // Construct emailContent
            const emailContent = await generateEmailBody(productInfo, emailNotifyType);
            // Get array of user emails
            const userEmails = updatedProduct.users.map((user: any) => user.email);
            // Send email notification
            await sendEmail(emailContent, userEmails);
          }

          return updatedProduct;
        })
      );

      return NextResponse.json({
        message: "Ok",
        data: updatedProducts,
      });
    } catch (error: any) {
      console.error(`Error occurred: ${error}`);
      throw new Error(`Failed to get all products: ${error.message}`);
    }
  }