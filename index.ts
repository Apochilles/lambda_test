import { LexEvent, LexResult, LexDialogActionDelegate } from "aws-lambda";
import * as aws from "@pulumi/aws";
import axios from "axios";
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

function delay() {
  // `delay` returns a promise
  return new Promise(function (resolve) {
    // Only `delay` is able to resolve or reject the promise
    setTimeout(function () {
      resolve(42); // After 3 seconds, resolve the promise with value 42
    }, 3000);
  });
}

async function asyncGet() {
  try {
    // fetch data from a url endpoint
    const data = await axios.get(
      "https://api-staging.bloglinkerapp.com/v1/status?shop=blog-linker-test-store-staging.myshopify.com"
    );
    await delay();
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
    // appropriately handle the error
  }
}

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

export const someLexFunction = new aws.lambda.CallbackFunction(
  "Post_Test_Lambda",
  {
    callback: async (event: LexEvent) => {
      const { slots, name } = event.currentIntent;
      const getResponse = await asyncGet();
      await asyncPost();
      await getConfirmation();

      if (getResponse.shop === null) {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "no_shop",
            slots,
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "My problem is solved",
                      value: "products",
                    },
                    {
                      text: "I need more help",
                      value: "help",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (getResponse.blogCount === null) {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "no_blog",
            slots,
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "My problem is solved",
                      value: "products",
                    },
                    {
                      text: "I need more help",
                      value: "help​",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (getResponse.relatedPostCount === null) {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "no_related_blog",
            slots,
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "My problem is solved",
                      value: "products",
                    },
                    {
                      text: "I need more help",
                      value: "​Debug me",
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (getResponse.relatedProductCount === null) {
        return {
          dialogAction: {
            type: "ElicitSlot",
            intentName: name,
            slotToElicit: "no_related_products",
            slots,
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "My problem is solved",
                      value: "products",
                    },
                    {
                      text: "I need more help",
                      value: "​​Debug me",
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
