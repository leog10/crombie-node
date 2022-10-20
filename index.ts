import express, { urlencoded } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const PORT = 5000;
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json(), urlencoded({ extended: true }));

type Product = {
  name: string;
  brand: string;
  id: number;
};

const products: Product[] = [];

app.get('/product', (req, res) => {
  res.status(200).json({ products: products });
});

app.post('/product', (req, res) => {
  const { name, brand } = req.body;
  const id = new Date().getTime();

  try {
    if (!name || !brand) throw new Error('campos invalidos');
    const newProduct = { name, brand, id };
    products.push(newProduct);
    res
      .status(201)
      .json({ msg: 'Producto creado con exito', product: newProduct });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

app.put('/product/:id', (req, res) => {
  const { name, brand } = req.body;
  const id = +req.params.id;

  try {
    if (!name || !brand) {
      throw new Error('campos incorrectos');
    }

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('producto no encontrado');
    }

    products[index].name = name;
    products[index].brand = brand;

    res.status(200).json({ msg: 'Producto actualizado con exito' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

app.delete('/product/:id', (req, res) => {
  res.status(200).json({ msg: 'Producto eliminado!' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
