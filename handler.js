'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');

const postsTable = process.env.POSTS_TABLE;

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

// Creating a user
module.exports.createUser = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  if (!reqBody.name || reqBody.name.trim() === '' || !reqBody.email || reqBody.email.trim() === '' || !reqBody.password || reqBody.password.trim() === '' ) {
    return callback(null,response(400, {
        error: 'Post must enter you name and email and they must not be empty'}));}
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
