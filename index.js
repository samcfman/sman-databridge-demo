const express = require('express');
const querystring = require('querystring');
const https = require('https');
const app = express();
const router = express.Router();
//const port = 3000;
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const { Client } = require ('pg');

const client = new Client ({
  connectionString: process.env.DATABASE_URL,
  ssl:true,
});
console.log('start');

client.connect();

var auth_code;
//getAuthCode();

function getAuthCode() {

  var auth_data = JSON.stringify({
    email: 'sman@salesforce.com',
    password: 'Qwer!234'
  });  

  var auth_options = {
    host: 'api.follow-apps.com',
   // port: '443',
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': auth_data.length
    }  
  };

  var req = https.request(auth_options, function(resp) {
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
     //   console.log('Response: ' + chunk);

        var obj = JSON.parse(chunk);

        obj.result;

        auth_token = obj.result.auth_token;
        console.log('auth_token' + auth_token);
    });
  }); 

  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(auth_data);
  req.end();  
};


//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// url: http://localhost:3000/
app.get('/', (request, response) => response.send('Nibs Segmentation'));

// all routes prefixed with /api
app.use('/api', router);



// this array is used for identification of allowed origins in CORS
const originWhitelist = ['http://localhost:5000', 'https://sman-apiendpt.herokuapp.com', 'https://sman-org-dev-ed.lightning.force.com'];


router.get('/', (request, response) => {
  response.json({message: 'Hello, welcome to my server'});
});

const url = require('url');

router.get('/doseg',(req,res)=>{
  var body=req.body;
  var customer = 'Alison Chan';
  var segment = 'DARK_ABC';


  client.query('UPDATE salesforce.contact SET segment__c = $1 WHERE name=$2 RETURNING name', [segment, customer], (error, results) => {
    if (error) {
      throw error
    }

    res.json({message: 'Segmentation Done' + results.fields[0]});
  });


//  var auth_token ;
 //var user_email = 'sambb@gmail.com';
/* var userid =  req.query.user;
 var campaginId = req.query.campaginid;


  var campaign_data = JSON.stringify({
    campaignKey: [campaginId],
    messages : [{user:userid}]
  });  

  console.log(campaign_data);

  var campaign_data_options = {
    host: 'api.follow-apps.com',
    port: '443',
    path: '/api/transac',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + auth_token,
        'Content-Length': campaign_data.length,
    }  
  };

  var campaign_req = https.request(campaign_data_options, function(camp_resp) {
        camp_resp.setEncoding('utf8');
        camp_resp.on('data', function (chunk) {
   
            res.json({message: 'Campagin: ' + campaginId + ' ' + '; user: ' + userid + ' ' + '; Response: ' + chunk});
            
        });
    });

    campaign_req.on('error', error => {
 //     console.log ('sam error');
      console.error(error)
    });
    
    campaign_req.write(campaign_data);
    campaign_req.end();  
    */ 
});


// set the server to listen on port 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
