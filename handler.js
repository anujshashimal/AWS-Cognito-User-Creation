'use strict';
module.exports.hello =(event, context, callback) => {

  // if(event.queryStringParameters && event.queryStringParameters.name){
  //   return callback(null, {
  //     body: JSON.stringify({
  //       message: 'Welcome ' + event.queryStringParameters.name ,
  //     }),
  //   })
  // }

  if(event.httpMethod === 'POST' && event.body){

    let json = JSON.parse(event.body)
    
    return callback(null, {
      body: JSON.stringify({
        message: 'Hi I Received msg!',
        object: json
      }),
    }
    )}

    if(event.queryStringParameters.name === 'anuj'){
      return callback(null, 
      {
          body: JSON.stringify(
              {
                message: 'You cant access to the system'
              }
          )
      })
    }
    
  const response = {
    statusCode:200,
    body: JSON.stringify({
      message: 'Welcome' + event.queryStringParameters.name
    }),
  };

callback(null, response)
};
 
       

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

