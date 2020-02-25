'use strict';
const AWS = require('aws-sdk');
const CognitoSDK = require('amazon-cognito-identity-js')
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const postsTable = process.env.POSTS_TABLE;
const attributeList = [];
// const CognitoUserAttribute = require('amazon-cognito-identity-js')
module.exports.testing = function(event) {  
  try {
  const poolData = {
    UserPoolId: 'us-east-1_7KRHMq0Kz',
    ClientId: '517j0l4fd970grm1oub46mrm1p'
  };

  const data = event.body;
  const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

var username = {
  Name : 'username',
  Value : data.name
  };
var email = {
  Name : 'email',
  Value : data.email
  };
var password = {
  Name : 'password',
  Value : data.password
  };

const attributeName = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(username);
const attributeEmail = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(email);
const attributePassword = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(password);

attributeList.push(attributeName);
attributeList.push(attributeEmail);
attributeList.push(attributePassword);
var cognitoUser;
userPool.signUp('username','email', 'password', attributeList, null, function(err, result){
  if (err) {alert(err);return;}
  cognitoUser = result.user;
});

  } catch (error) {
  console.log(error)

}

  module.exports.signup = async (callback) => {
 try{
    const data = event.body;
    CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    if (!data.name || data.name.trim() === '' || !data.email || data.email.trim() === '' || !data.password || data.password.trim() === '' ) {
      return callback(null,response(400, {error: 'User must enter you name and email and they must not be empty'}));}
    else {
      try {
          attributeList.push(AWS.cognitoUserAttribute({
          Name: 'username',
          Value: data.name,
        })), 
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'email',
          Value: data.email,
        })),
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'password',
          Value: data.password,
        }));
      const userPool = AWS.cognitoUserPool(poolData);
      userPool.signUp(attributeList);
    } catch (error) {
      return responseHelper.sendError(500, `Error`, error);

    }
    // const addUser = await AWS.CognitoUserPool.createUser();
    if (addUser) { callback({statusMessage: util.statusMessage.USER_REGISTERED_SUCCESSFULLY,result : addUser});return;}
    else {callback({statusMessage: util.statusMessage.SERVER_BUSY});return;}
    } 
  }catch (error){
    return responseHelper.sendError(500, `Error`, error);
  }
  }
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.login = async (event, context) => {
  const data = JSON.parse(event.body);
  const poolData = {
    UserPoolId: 'us-east-1_7KRHMq0Kz',
    ClientId: '517j0l4fd970grm1oub46mrm1p'
  };

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
	Email: data.email,
	Pool: userPool,
};

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.confirmRegistration('123456', true, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;}
	console.log('call result: ' + result);
})}

// Creating a user
// module.exports.createUser = (event, context, callback) => {
//   const reqBody = JSON.parse(event.body);

//   if (!reqBody.name || reqBody.name.trim() === '' || !reqBody.email || reqBody.email.trim() === '' || !reqBody.password || reqBody.password.trim() === '' ) {
//     return callback(null,response(400, {error: 'Post must enter you name and email and they must not be empty'}));
//     }
//   const post = {
//     id: uuid(),
//     createdAt: new Date().toISOString(),
//     userId: 1,
//     name: reqBody.name,
//     email: reqBody.email,
//     password: reqBody.password,
//   };
  
//   return db.put({
//       TableName: postsTable,
//       Item: post
//     }).promise().then(() => {
//       callback(null, response(201, post));
//     }).catch((err) => response(null, response(err.statusCode, err)));

// };


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

}
