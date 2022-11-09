import express from 'express';
import cors from 'cors';
import productsRoute from './routes/products';

const app = express();

/* const corsOptions = {
  origin: 'https://radiant-kitten-56bc13.netlify.app',
}; */

/* const corsOptions = {
  origin: 'http://localhost:3000', 
}; */

app.use(cors());
app.use(express.json());
app.use('/product', productsRoute);

app.listen(5000, () => {
  console.log(`App listening on port ${5000}`);
});
