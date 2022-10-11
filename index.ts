import express from 'express';
const app = express();

app.get('/hola', (req, res) => {
  res.status(200).json({ msg: 'Hola mundo!!!' });
});

app.listen(3000, () => {
  console.log('app in http://localhost:3000');
});
