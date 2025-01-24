const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./libs/sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
          //   Data: "<h1>This is the email body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
        // Data: "This is a test email from Amazon SES", // EMAIL_SUBJECT
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    //   these email ids should be verified in amazon SES, else email will not go through sandBox
    "recipient@example.com", // email (toAddress)
    "sender@example.com", // domain (fromAddress)
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
