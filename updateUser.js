const api = {};
const AWS = require("aws-sdk");
const TABLE_NAME =  process.env.TABLE_NAME;

api.handler = async (event) => {

    let response = {};
    
    try {
        console.log(event.requestContext.http.path, event.requestContext.http.method)
        if(event.requestContext.http.path.includes('users') && event.requestContext.http.method == 'GET' ) {
            let id = event.pathParameters.id;
            if (id) {
                response.body = JSON.stringify(await api.getUsersByIDHandler(id));
            } else {
                response.body = JSON.stringify(await api.getUsersHandler());
            }
            response.statusCode = 200;
            } else {
                response.body = 'Bad Request';
                response.statusCode = 400;
            }
    } catch (e) {
        console.log(e)
        response.body = "Error occurred";
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