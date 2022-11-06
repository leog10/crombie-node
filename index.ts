import express from 'express';
import cors from 'cors';

const app = express();

/* const corsOptions = {
  origin: 'https://radiant-kitten-56bc13.netlify.app',
}; */

/* const corsOptions = {
  origin: 'http://localhost:3000',
}; */

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
  const name = req.query.name as string;
  const brand = req.query.brand as string;
  const limit = req.query.limit || '5';
  const page = !req.query.page || req.query.page === '0' ? '1' : req.query.page;
  const offset = +page - 1 && (+page - 1) * +limit;
  const nextLimit = offset + +limit;

  if (+req.query.limit < 0 || req.query.limit === '0') {
    return res.status(400).json('Query limit must be a positive number');
  }

  if (+req.query.limit > 15) {
    return res
      .status(400)
      .json({ error: 'Query limit exceeded. Max limit: 15' });
  }

  if (name) {
    try {
      const productsDto: ProductDto[] = products
        .filter(
          (p) => !p.deleted && p.name.toLowerCase().includes(name.toLowerCase())
        )
        .map((p) => ({
          name: p.name,
          brand: p.brand,
          price: p.price,
          id: p.id,
        }));

      if (productsDto.length) {
        const pages = Math.ceil(productsDto.length / +limit);

        try {
          const result = productsDto.slice(offset, nextLimit);

          if (!result.length) {
            return res.status(200).json([]);
          }

          const showing =
            productsDto.length === 0
              ? '0'
              : offset + 1 === nextLimit || offset + 1 === productsDto.length
              ? `${offset + 1} of ${productsDto.length}`
              : nextLimit > productsDto.length
              ? `${offset + 1}-${productsDto.length} of ${productsDto.length}`
              : pages === 1
              ? `1-${productsDto.length} of ${productsDto.length}`
              : `${offset + 1}-${nextLimit} of ${productsDto.length}`;

          return res.status(200).json({
            products: result,
            page: `${+page}/${pages}`,
            showing,
          });
        } catch (error) {
          console.log(error);
        }
      }

      return res
        .status(404)
        .json({ error: 'No products found with your search keywords' });
    } catch (error) {
      console.log(error);
    }
  } else if (brand) {
    try {
      const productsDto: ProductDto[] = products
        .filter(
          (p) =>
            !p.deleted && p.brand.toLowerCase().includes(brand.toLowerCase())
        )
        .map((p) => ({
          name: p.name,
          brand: p.brand,
          price: p.price,
          id: p.id,
        }));

      if (productsDto.length) {
        const pages = Math.ceil(productsDto.length / +limit);

        try {
          const result = productsDto.slice(offset, nextLimit);

          if (!result.length) {
            return res.status(200).json([]);
          }

          const showing =
            productsDto.length === 0
              ? '0'
              : offset + 1 === nextLimit || offset + 1 === productsDto.length
              ? `${offset + 1} of ${productsDto.length}`
              : nextLimit > productsDto.length
              ? `${offset + 1}-${productsDto.length} of ${productsDto.length}`
              : pages === 1
              ? `${productsDto.length} of ${productsDto.length}`
              : `${offset + 1}-${nextLimit} of ${productsDto.length}`;

          return res.status(200).json({
            products: result,
            page: `${+page}/${pages}`,
            showing,
          });
        } catch (error) {
          console.log(error);
        }
      }

      return res
        .status(404)
        .json({ error: 'No products found with your search keywords' });
    } catch (error) {
      console.log(error);
    }
  } else {
    const productsDto: ProductDto[] = products
      .filter((p) => !p.deleted)
      .map((p) => ({
        name: p.name,
        brand: p.brand,
        price: p.price,
        id: p.id,
      }));

    const pages = Math.ceil(productsDto.length / +limit);

    try {
      const result = productsDto.slice(offset, nextLimit);

      if (!result.length) {
        return res.status(200).json([]);
      }

      const showing =
        productsDto.length === 0
          ? '0'
          : offset + 1 === nextLimit || offset + 1 === productsDto.length
          ? `${offset + 1} of ${productsDto.length}`
          : nextLimit > productsDto.length
          ? `${offset + 1}-${productsDto.length} of ${productsDto.length}`
          : pages === 1
          ? `${productsDto.length} of ${productsDto.length}`
          : `${offset + 1}-${nextLimit} of ${productsDto.length}`;

      return res.status(200).json({
        products: result,
        page: `${+page}/${pages}`,
        showing,
      });
    } catch (error) {
      console.log(error);
    }
  }
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

    return res.status(200).json(productDto);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

app.post('/product', (req, res) => {
  const { name, brand, price } = req.body;
  const id = new Date().getTime();

  try {
    if (!name || !brand || !price)
      throw new Error('error: name, brand and price are required');
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
    const index = products.findIndex((p) => p.id === id);

    if (index === -1 || products[index].deleted) {
      throw new Error('product not found');
    }

    if (name) {
      products[index].name = name;
    }

    if (brand) {
      products[index].brand = brand;
    }

    if (price) {
      products[index].price = price;
    }

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
