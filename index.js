const express = require('express');
const app = express();

app.get('/hola', (req, res) => {
  res.json({ msg: 'Hola mundo!!!' });
});

app.listen(3000, () => {
  console.log('app in http://localhost:3000');
});
