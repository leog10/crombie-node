import express, { urlencoded } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

type Product = {
  name: string;
  brand: string;
  price: number;
  id: number;
  deleted: boolean;
};

type ProductDto = {
  name: string;
  brand: string;
  price: number;
  id: number;
};

const products: Product[] = [];

app.get('/product', (req, res) => {
  const productsDto: ProductDto[] = products
    .filter((p) => !p.deleted)
    .map((p) => ({
      name: p.name,
      brand: p.brand,
      price: p.price,
      id: p.id,
    }));

  res.status(200).json(productsDto);
});

app.get('/product/:id', (req, res) => {
  const id = +req.params.id;

  try {
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Product not found');
    }

    if (products[index].deleted) throw new Error('Product not found');

    const productDto: ProductDto = {
      name: products[index].name,
      brand: products[index].brand,
      price: products[index].price,
      id: products[index].id,
    };

    res.status(200).json(productDto);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

app.post('/product', (req, res) => {
  const { name, brand, price } = req.body;
  const id = new Date().getTime();

  try {
    if (!name || !brand) throw new Error('error: name and brand are required');
    const newProduct: Product = { name, brand, price, id, deleted: false };
    products.push(newProduct);
    const newProductDto: ProductDto = { name, brand, price, id };
    res.status(201).json({ msg: 'Product created', product: newProductDto });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

app.put('/product/:id', (req, res) => {
  const { name, brand, price } = req.body;
  const id = +req.params.id;

  try {
    if (!name || !brand || !price) {
      throw new Error('error: name, brand and price are required');
    }

    const index = products.findIndex((p) => p.id === id);

    if (index === -1 || products[index].deleted) {
      throw new Error('product not found');
    }

    products[index].name = name;
    products[index].brand = brand;
    products[index].price = price;

    res.status(200).json({ msg: 'Product updated' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

app.delete('/product/:id', (req, res) => {
  const id = +req.params.id;

  try {
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('product not found');
    }

    if (products[index].deleted) {
      throw new Error('product not found');
    } else {
      products[index].deleted = true;
    }

    res.status(200).json({ msg: `Product with id: ${id} deleted` });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

app.listen(5000, () => {
  console.log(`App listening on port ${5000}`);
});
