'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const postsTable = process.env.POSTS_TABLE;
var attributeList = [];

const poolData = {
  UserPoolId: 'us-east-1_nDfxWYKwM',
  ClientId: '1fl22t1t1q58g2rjlppv97e0nh'
};

  module.exports.signup = async (data, callback) => {
    const data = JSON.parse(event.body);
    // const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    if (!data.name || data.name.trim() === '' || !data.email || data.email.trim() === '' || !data.password || data.password.trim() === '' ) {
      return callback(null,response(400, {error: 'Post must enter you name and email and they must not be empty'}));
    }
       else {
        try {
          attributeList.push(AWS.cognitoUserAttribute({
          Name: 'name',
          Value: name,
        })), 
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'email',
          Value: email,
        })),
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'password',
          Value: password,
        }));
      const userPool = AWS.cognitoUserPool(poolData);
      userPool.signUp(name, email, password, attributeList);
    } catch (error) {
      throw error;
    }
    // const addUser = await AWS.CognitoUserPool.createUser();
    if (addUser) { callback({statusMessage: util.statusMessage.USER_REGISTERED_SUCCESSFULLY,result : addUser});return;}
    else {callback({statusMessage: util.statusMessage.SERVER_BUSY});return;}
    } 
  }
  
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.login = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const userData = {
    name = data.email,
    password = data.password
  }

  if (!data.email || !data.password){
    return callback( null, response(400, {error: 'You must enter the valid Username and Password'}))}
  else{
    const chkUser = await AWS.CognitoUserPool.fetchUser(userData);
    if(chkUser){ callback(null, "You Successfually logged to the System")} 
    else{ callback(null, module.exports.signup)}
  }
}

// Creating a user
module.exports.createUser = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  if (!reqBody.name || reqBody.name.trim() === '' || !reqBody.email || reqBody.email.trim() === '' || !reqBody.password || reqBody.password.trim() === '' ) {
    return callback(null,response(400, {error: 'Post must enter you name and email and they must not be empty'}));
    }

  const post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    userId: 1,
    name: reqBody.name,
    email: reqBody.email,
    password: reqBody.password,
  };
  
  return db.put({
      TableName: postsTable,
      Item: post
    }).promise().then(() => {
      callback(null, response(201, post));
    }).catch((err) => response(null, response(err.statusCode, err)));

};


// module.exports.getItemFromDB(String)
//  {
//   const params = {
//     TableName: postsTable,
//     Key: {
//       id
//     }
//   };
// return dynamoDB.get(params).promise().then(res => res.Item).catch(err => err);
// }

  
