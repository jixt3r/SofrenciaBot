//const http = require('http');
//const hostname = '127.0.0.1';
const axios = require('axios');
const fs = require('fs');

axios
  .get('https://discord.com/api/v9/users/393094770794299392')
  .then(res => {
       console.log(res.data)
  })
  .catch(error => {
    console.error(error)
  })
