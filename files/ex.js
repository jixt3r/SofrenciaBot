require('dotenv/config');
const https = require('https');
const options = {
  hostname: '',
  port: 443,
  path: '',
  method: 'GET',
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    console.log(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
