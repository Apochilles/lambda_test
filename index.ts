import { LexEvent, LexResult, LexDialogActionDelegate } from "aws-lambda";
import * as aws from "@pulumi/aws";
import axios from "axios";

// Makes a asynchronous POST request to sync the users the changes on the users store.
async function asyncPost() {
  try {
    const data = await axios.post(
      "https://api-staging.bloglinkerapp.com/v1/update_post_data?shop=blog-linker-test-store-staging.myshopify.com"
    );
    if (data.status == 200) {
      return console.log("Syncing successful");
    } else {
      console.log("Syncing unsuccesful");
    }
    return data;
  } catch (error) {
    if (error.response.status == "403") console.log("Syncing unsuccesful");
    console.log("error", error);
  }
}

// Makes a asynchronous GET request to get information from the users store.
async function asyncGet() {
  try {
    // fetch data from a url endpoint
    const data = await axios.get(
      "https://api-staging.bloglinkerapp.com/v1/status?shop=blog-linker-test-store-staging.myshopify.com"
    );
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
    // appropriately handle the error
  }
}
// Logs the GET request on server side to debug if it errors out on the client side.
async function getConfirmation() {
  const response = await asyncGet();
  console.log(response);
  if (response.data.shop != null)
    console.log("Your store is " + response.data.shop);
  else console.log("You do not have a shop");
  if (response.data.shop != null)
    console.log("Your store is " + response.data.shop);
  else console.log("You do not have a shop");
  if (response.data.blogCount != null)
    console.log("You have " + response.data.blogCount + " blog posts");
  else console.log("You do not have any blogs");
  if (response.data.availableBlogCount != null)
    console.log("You have " + response.data.availableBlogCount + " blog posts");
  else console.log("You don't have any available blogs");
  if (response.data.relatedPostCount != null)
    console.log(
      "You have " + response.data.relatedPostCount + " related blog posts"
    );
  else console.log("You do not have any available blogs");
  if (response.data.relatedPostCount != null)
    console.log(
      "You have " + response.data.relatedProductCount + " related products"
    );
  else console.log("You do not have any related products");
}

export const debuggingIntent = new aws.lambda.CallbackFunction(
  "Debugging_Lambda",
  {
    callback: async (event: LexEvent) => {
      const { slots } = event.currentIntent;
      const getResponse = await asyncGet();
      await asyncPost();
      await getConfirmation();

      if (
        getResponse.shop !== null &&
        getResponse.blogCount !== null &&
        getResponse.relatedPostCount !== null &&
        getResponse.relatedProductCount !== null
      ) {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "I have looked at your shop on our end and everything seems to be in order. ",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  title: "Please select the button that best suits your issue:",
                  imageUrl:
                    "https://i.ytimg.com/vi/kCtUmkgtHYs/maxresdefault.jpg",
                  buttons: [
                    {
                      text: "I want my product pages to show up on my blog",
                      value: "products",
                    },
                    {
                      text: "How do I use tags with Blog Linker",
                      value: "tags",
                    },
                    {
                      text:
                        "How do I make my related products to populate on my blog posts",
                      value: "populate",
                    },
                    {
                      text: "My images and text look wrong ",
                      value: "css",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (
        getResponse.shop === null &&
        getResponse.blogCount === null &&
        getResponse.relatedPostCount === null &&
        getResponse.relatedProductCount === null
      ) {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "I am not detecting your Shopify store which means you have a few steps you need to work through.",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  title:
                    "Press here to learn how to integrate your Shopify store.",
                  imageUrl:
                    "https://i.ytimg.com/vi/kCtUmkgtHYs/maxresdefault.jpg",
                  buttons: [
                    {
                      text: "Click me",
                      value: "store",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (
        getResponse.shop !== null &&
        getResponse.blogCount === null &&
        getResponse.relatedPostCount === null &&
        getResponse.relatedProductCount === null
      ) {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "I am detecting your shopify store but you have a few other problems.",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  title:
                    "Press here to learn how to set up your blogs and enable related post and related products.",
                  imageUrl:
                    "https://i.ytimg.com/vi/kCtUmkgtHYs/maxresdefault.jpg",
                  buttons: [
                    {
                      text: "Click me",
                      value: "Blog count",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (
        getResponse.shop !== null &&
        getResponse.blogCount !== null &&
        getResponse.relatedPostCount === null &&
        getResponse.relatedProductCount === null
      ) {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "I am detecting your shopify store and blogs but you have a few other problems. ",
            },

            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  title:
                    "Press here to learn how to set up related post and related products.",
                  imageUrl:
                    "https://i.ytimg.com/vi/kCtUmkgtHYs/maxresdefault.jpg",
                  buttons: [
                    {
                      text: "Click me",
                      value: "rel_post",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (
        getResponse.shop !== null &&
        getResponse.blogCount !== null &&
        getResponse.relatedPostCount !== null &&
        getResponse.relatedProductCount === null
      ) {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "I am detecting you have a shopify store but you do not have related posts or related products ",
            },

            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  title:
                    "Press here to learn how to set up related post and related products.",
                  imageUrl:
                    "https://i.ytimg.com/vi/kCtUmkgtHYs/maxresdefault.jpg",
                  buttons: [
                    {
                      text: "Click me",
                      value: "rel_prod",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else {
        return {
          dialogAction: {
            type: "Delegate",
            slots,
          },
        };
      }
    },
  }
);
