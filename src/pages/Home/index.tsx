import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return (sumAmount = {
      ...sumAmount,
      [product.id]: product.amount,
    });
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const prod = await api.get('/products').then(({ data }) => data);
      const productFormatted = prod.map((product: Product) => {
        const p = {
          ...product,
          priceFormatted: formatPrice(product.price),
        };

        return p;
      });

      setProducts(productFormatted);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(({ image, id, priceFormatted, title }) => (
        <li key={id}>
          <img src={image} alt={title} />
          <strong>{title}</strong>
          <span>{priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[Number(id)] || 0} 2
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
