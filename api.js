const db = require("./db");
const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");


const createClip = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
   
  };

  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };
    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully created clip",
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to create clip",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }

  return response;
};


module.exports = {
  createClip,
};
