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

      await asyncPost();

      (async function () {
        let response = await asyncGet();
        if (response.data.shop != null) {
          return {
            dialogAction: {
              type: "ElicitSlot",
              intentName: name,
              slotToElicit: "sync_evaluation",
              slots,
              message: {
                contentType: "CustomPayload",
                content: "Success ;)",
              },
            },
          };
        } else return console.log("hi");
      })();

      return {
        dialogAction: {
          type: "Delegate",
          slots,
        },
      };
    },
  }
);
