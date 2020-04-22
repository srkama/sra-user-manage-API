const api = {};
const AWS = require("aws-sdk");
const TABLE_NAME =  process.env.TABLE_NAME;

api.handler = async (event) => {
    let response = {};
    console.log('Table Name', TABLE_NAME);
    let reqBody = JSON.parse(event.body);
    try {
        if(event.path.includes('users')) {
            response.body = JSON.stringify(await api.createUserHandler(reqBody));
            response.statusCode = 200;
            } else {
                response.body = JSON.stringify('Bad Request');
                response.statusCode = 400;
            }
    } catch (e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    return response;
};

api.createUserHandler = (user) => {
    return new Promise((resolve, reject) => {
        let params  = {
            TableName: TABLE_NAME,
            Item: user
        };
        let dynamoClient = new AWS.DynamoDB.DocumentClient();
        dynamoClient.put(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
};


module.exports = api;