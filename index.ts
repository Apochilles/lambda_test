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

        console.log(data.status);
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
    console.log(data);

    return await data;
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

      await asyncGet();
      await asyncPost();

      if (slots.sync_evaluation === "yes") {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content: "Cool no probs.",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "further help",
                      value: "help",
                    },
                    {
                      text: "Give us feedback!",
                      value: "hello",
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      if (slots.debugging_clarification === "yes") {
        return {
          dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message: {
              contentType: "PlainText",
              content: "Cool no probs.",
            },
            responseCard: {
              version: "0",
              contentType: "application/vnd.amazonaws.card.generic",
              genericAttachments: [
                {
                  buttons: [
                    {
                      text: "further help",
                      value: "help",
                    },
                    {
                      text: "Give us feedback!",
                      value: "hello",
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
