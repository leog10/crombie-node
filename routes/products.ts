import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/products';
import express from 'express';

const productsRoute = express.Router();

productsRoute.get('/', getProducts);
productsRoute.get('/:id', getProductById);
productsRoute.post('/', createProduct);
productsRoute.put('/:id', updateProduct);
productsRoute.delete('/:id', deleteProduct);

export default productsRoute;
