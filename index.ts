import { LexEvent } from "aws-lambda";
import * as aws from "@pulumi/aws";
var axios = require("axios");

async function asyncPost() {
  let data;
  try {
    await axios
      .post(
        "https://api-staging.bloglinkerapp.com/v1/update_post_data?shop=blog-linker-test-store-staging.myshopify.com"
      )
      .then((result) => {
        data = result;

        if (data.status == "200") console.log("Syncing successful");
        else console.log("Syncing unsuccesful");
      });
    return await data;
  } catch (error) {
    console.log("error", error);
  }
}

async function asyncGet() {
  try {
    // fetch data from a url endpoint
    const data = await axios.get(
      "https://api-staging.bloglinkerapp.com/v1/status?shop=blog-linker-test-store-staging.myshopify.com"
    );
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
}

export const someLexFunction = new aws.lambda.CallbackFunction(
  "Post_Test_Lambda",
  {
    callback: async (event: LexEvent) => {
      let { slots, name } = event.currentIntent;
      asyncPost();

      (async function () {
        let response = await asyncGet();
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
          console.log(
            "You have " + response.data.availableBlogCount + " blog posts"
          );
        else console.log("You don't have any available blogs");
        if (response.data.relatedPostCount != null)
          console.log(
            "You have " + response.data.relatedPostCount + " related blog posts"
          );
        else console.log("You do not have any available blogs");
        if (response.data.relatedPostCount != null)
          console.log(
            "You have " +
              response.data.relatedProductCount +
              " related products"
          );
        else console.log("You do not have any related products");
      })();

      if (slots.debugging_clarification === "yes") {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content:
                "Good to hear! Let me know if I can help you with anything else",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "further help",
                      value: "options",
                    },
                    {
                      text: "Give us feedback!",
                      value: "feedback",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      if (slots.sync_evaluation === "yes") {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content: "What is the problem you are encountering?",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
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
                    {
                      text: "More options",
                      value: "more",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      if (slots.sync_evaluation === "no") {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "options",
            slots,

            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
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
                    {
                      text: "More options",
                      value: "more",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      if (slots.further_options === "more") {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "final_options",
            slots,

            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "Option 5",
                      value: "products",
                    },
                    {
                      text: "Option 6",
                      value: "tags",
                    },
                    {
                      text: "Option 7",
                      value: "populate",
                    },
                    {
                      text: "Option 8 ",
                      value: "css",
                    },
                    {
                      text: "More options",
                      value: "more",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      if (slots.options === "more") {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "further_options",
            slots,

            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
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
                    {
                      text: "More options",
                      value: "more",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      return {
        dialogAction: {
          type: "Delegate",
          slots,
        },
      };
    },
  }
);
