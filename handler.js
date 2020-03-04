'use strict';
const AWS = require('aws-sdk');
require('cross-fetch/polyfill');
const AWSCognito = require('amazon-cognito-identity-js')
const CognitoUserPool = AWSCognito.CognitoUserPool;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const postsTable = process.env.POSTS_TABLE;
const cognitoEnvClientID = process.env.UserPoolId
const cognitoEnvPoolId = process.env.ClientId
const attributeList = [];
global.fetch = require('node-fetch');
AWS.config.apiVersions = {
  cognitoidentityserviceprovider: '2016-04-18',
};

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b7ac9d19-027a-49f5-ad7b-856e4433b2c9',
});

AWS.config.apiVersions = {
  cognitoidentityserviceprovider: '2016-04-18',
  // other service API versions
};


function createResponse(status, body) {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(body)
  }
}


//-----------------------function1-----------------------
const poolData = {UserPoolId: cognitoEnvClientID, ClientId: cognitoEnvPoolId};

module.exports.testing = function(event, context, callback) {

      const data = JSON.parse(JSON.stringify(event))
      const username = {Name : 'given_name',Value : data.name};
      const email = {Name : 'email',Value : data.email};
      const mobileNum = {Name : 'phone_number',Value : data.mobileNum};

      console.log(event)

      const userPool = new AWSCognito.CognitoUserPool(poolData);
      const userData = {
        Username: data.email,
        Pool: userPool}

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
          return callback(null, createResponse(404, 'Error'))
        }
	    const cognitoUser = result.user;
          console.log('username is ' + cognitoUser.getUsername());
          return callback(null, createResponse(200,'Success!'))
      })
}


//-----------------------function2-----------------------

module.exports.auth = async(event) => {

console.log('First!',event)
  const data = JSON.parse(event.body)

  const poolData = {UserPoolId: cognitoEnvClientID, ClientId: cognitoEnvPoolId};
  const userPool = new AWSCognito.CognitoUserPool(poolData);
  const userData = {
    Username: data.email,
    Pool: userPool,
  };

  const cognitoUser = new AWSCognito.CognitoUser(userData);

  cognitoUser.confirmRegistration(data.verifyNum, true, function(error, result) {
    if (error) {
      console.log("Something went wrong!")
      return send('Error')
    }
    console.log('call result: ' + result);
    return responseHelper.send('Success!')

  });
}

//-----------------------function3-----------------------


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


//-----------------------function4-----------------------


module.exports.login = async (event, context) => {
  const data = JSON.parse(event.body);
  console.log(data)
  console.log(event)

  const poolData = {
    UserPoolId: 'us-east-1_UpmO45G8o',
    ClientId: '5cuuf1r7jjm2mh9toqa7aottoe'
  };

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const userData = {
	Username: '',
	pool: userPool,
};

const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.confirmRegistration('739051', true, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;}
	console.log('call result: ' + result);
})}


//-----------------------function5-----------------------


module.exports.createUser = async (event, callback) => {
  const reqBody = JSON.parse(event.body);

  if (!reqBody.name || reqBody.name.trim() === '' || !reqBody.email || reqBody.email.trim() === '' || !reqBody.password || reqBody.password.trim() === '' ) {
    return callback(null,response(400, {error: 'Post must enter you name and email and they must not be empty'}));}  
  const post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
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



//-----------------------function6-----------------------



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


//-----------------------function7-----------------------


module.exports.getUser = async (event)  => {
  const data = JSON.parse(event)

  const poolData = {
    UserPoolId: 'us-east-1_UpmO45G8o',
    ClientId: '2gnb5hpsb4arauqukv12pjlac'
  };

  const userPool = new AWSCognito.CognitoUserPool(poolData);

  const userData = {
    Username: 'anujjayasekara102',
    pool: userPool,
  };

  const cognitoUser = new AWSCognito.CognitoUser(userData);
  try{
  cognitoUser.getUserAttributes(function(err, result) {
    
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
      }
    for (i = 0; i < result.length; i++) {
      console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
    }
  });
  } catch(err){
    console.log(err)
  }
}