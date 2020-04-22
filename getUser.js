const api = {};
const AWS = require("aws-sdk");
const TABLE_NAME =  process.env.TABLE_NAME;

api.handler = async (event) => {    
    let response = {};
    console.log(event);
    try {
        if(event.path.includes('users') && event.httpMethod == 'GET' ) {
            let id = event.pathParameters ? event.pathParameters['id'] : '';
            if (id) {
                response.body = JSON.stringify(await api.getUsersByIDHandler(id));
            } else {
                response.body = JSON.stringify(await api.getUsersHandler());
            }
            response.statusCode = 200;
            } else {
                response.body = JSON.stringify('Bad Request');
                response.statusCode = 400;
            }
    } catch (e) {
        console.log(e);
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    return response;
};

api.getUsersHandler = () => {
    return new Promise((resolve, reject) => {
        let params  = {
            TableName: TABLE_NAME,
        };
        let dynamoClient = new AWS.DynamoDB.DocumentClient();
        dynamoClient.scan(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
};

api.getUsersByIDHandler= (id) => {
    return new Promise((resolve, reject) => {
        let params  = {
            TableName: TABLE_NAME,
            Key: {
            userId: id
            }
        };
        let dynamoClient = new AWS.DynamoDB.DocumentClient();
        dynamoClient.get(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
};



module.exports = api;