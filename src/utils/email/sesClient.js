// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/libs/sesClient.js

const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1"; // this region should match
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,

  // for javascriptv3 credential are passed as format shown-
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },

  // for javascriptv2 credential were passed as format shown-
  // accessKeyId: process.env.AWS_ACCESS_KEY,
  // secretAccessKey: process.env.AWS_SECRET_KEY,
});

module.exports = { sesClient };
