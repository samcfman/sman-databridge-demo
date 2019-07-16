const express = require('express');
const querystring = require('querystring');
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

client.connect();

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// url: http://localhost:3000/
app.get('/', (request, response) => response.send('Nibs Segmentation'));

// all routes prefixed with /api
app.use('/api', router);



// this array is used for identification of allowed origins in CORS
const originWhitelist = ['http://localhost:5000', 'https://sman-apiendpt.herokuapp.com', 'https://sman-org-dev-ed.lightning.force.com'];

// middleware route that all requests pass through
/*router.use((request, response, next) => {
  console.log('Server info: Request received');

  let origin = request.headers.origin;
  console.log(origin);

  // only allow requests from origins that we trust
  if (originWhitelist.indexOf(origin) > -1) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }

  // only allow get requests, separate methods by comma e.g. 'GET, POST'
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);

  // push through to the proper route

  next();
});
*/
// using router.get() to prefix our path
// url: http://localhost:3000/api/
router.get('/', (request, response) => {
  response.json({message: 'Hello, welcome to my server'});
});

const url = require('url');

router.get('/doseg',(req,res)=>{
//  console.log(req.body);
  var body=req.body;
  var customer = 'Sam Man';
  var segment = 'DARK';


  client.query('UPDATE salesforce.contact SET segment__c = $1 WHERE name=$2 RETURNING name', [segment, customer], (error, results) => {
    if (error) {
      throw error
    }

  //  res.json({message: 'Segmentation Done'});
  })

  var auth_data = querystring.stringify({
    "email": "sman@salesforce.com",
    "password": "Qwer!234"
  });  


  res.json({message: 'Segmentation Done'});
  /*
  var auth_options = {
    host: 'https://api.follow-apps.com',
    port: '443',
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }  
  };

  // Set up the request
  var req = http.request(auth_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  req.on('error', error => {
    console.error(error)
  });
  
  req.write(auth_data);
  req.end();  
  */
});

// set the server to listen on port 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
