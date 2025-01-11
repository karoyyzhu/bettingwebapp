const path = require('path')
const express = require('express')
const ejs = require('ejs')

var app = express()

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
