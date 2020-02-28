'use strict';
const AWS = require('aws-sdk');
const AWSCognito = require('amazon-cognito-identity-js')
const CognitoUserPool = AWSCognito.CognitoUserPool;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const postsTable = process.env.POSTS_TABLE;
const attributeList = [];
global.fetch = require('node-fetch');
const lamda = new AWS.Lamda()

module.exports.testing = function(event) {  
const data = JSON.parse(JSON.stringify(event))

//adding Trigger
  // const parm = {
  //   FunctinName : 'UserVerification',
  //   InvocationType : 'RequestResponse',
  //   LogType: 'Tail'
  // }
  
      const username = {Name : 'given_name',Value : data.name};
      const email = {Name : 'email',Value : data.email};
      const mobileNum = {Name : 'phone_number',Value : data.mobileNum};

  const poolData = {UserPoolId: 'us-east-1_VgnmxXYMF',ClientId: '2gnb5hpsb4arauqukv12pjlac'};
  console.log(event)

  const userPool = new AWSCognito.CognitoUserPool(poolData);
  const userData = {
    Username: data.email,
    Pool: userPool
}

  const CognitoUserAttribute = new AWSCognito.CognitoUser(userData);
const attributeName = new AWSCognito.CognitoUserAttribute(username);
const attributeEmail = new AWSCognito.CognitoUserAttribute(email);
// const attributePassword = new AWSCognito.CognitoUserAttribute(password);
const attributeMobile= new AWSCognito.CognitoUserAttribute(mobileNum);

attributeList.push(attributeName);
attributeList.push(attributeEmail);
// attributeList.push(attributePassword);
attributeList.push(attributeMobile)

console.log(attributeName)

userPool.signUp(data.username, data.password , attributeList, null , function(err,result) {
	if (err) {
    console.log(err)
    return;
	}
	var cognitoUser = result.user;
  console.log('user name is ' + cognitoUser.getUsername());
  
  // lamda.invoke(parm, (err, result) => {
  //   if(err){
  //     console.log('Error')
  //   }else{
  //     console.log('Success!')
  //   }

  // })
})

//User verification code 
}

module.exports.auth = async(event) => {
  const data = JSON.parse(JSON.stringify(event))

  const poolData = {UserPoolId: 'us-east-1_VgnmxXYMF',ClientId: '2gnb5hpsb4arauqukv12pjlac'};
  console.log(event)

  const userPool = new AWSCognito.CognitoUserPool(poolData);
  const userData = {
    Username: data.email,
    Pool: userPool
}

  const CognitoUserAttribute = new AWSCognito.CognitoUser(userData);

console.log(data.verifyNum)
cognitoUser.confirmRegistration(data.verifyNum, true, function(err, result) {

  if (err) {
    console.log(err)
    return;
  }
  console.log('call result: ' + result);
});}

  module.exports.signup = async (callback) => {
 try{
    const data = event.body;
    CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    if (!data.name || data.name.trim() === '' || !data.email || data.email.trim() === '' || !data.password || data.password.trim() === '' ) {
      return callback(null,response(400, {error: 'User must enter you name and email and they must not be empty'}));}
    else {
      try {
          attributeList.push(AWS.cognitoUserAttribute({
          Name: 'phonenumber',
          Value: data.name,
        })), 
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'res',
          Value: data.email,
        })),
        attributeList.push(AWS.cognitoUserAttribute({
          Name: 'address',
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
  console.log(data)
  console.log(event)

  const poolData = {
    UserPoolId: 'us-east-1_UpmO45G8o',
    ClientId: '5cuuf1r7jjm2mh9toqa7aottoe'
  };

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
	Username: data.username,
	pool: userPool,
};

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.confirmRegistration('123456', true, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;}
	console.log('call result: ' + result);
})}

// Creating a user

module.exports.createUser = async (event, callback) => {
  const reqBody = JSON.parse(event.body);

  if (!reqBody.name || reqBody.name.trim() === '' || !reqBody.email || reqBody.email.trim() === '' || !reqBody.password || reqBody.password.trim() === '' ) {
    return callback(null,response(400, {error: 'Post must enter you name and email and they must not be empty'}));}  
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


exports.tester = async (event) => {
  switch (event.httpMethod) {
      case 'POST':
          const data = JSON.parse(event.body)
          console.log(data)
          break;
      default:
          throw new Error(`Unsupported method "${event.httpMethod}"`);
  }
  return {
      statusCode: 200,
      body: JSON.stringify({message: 'Success'})
      
  }
};
