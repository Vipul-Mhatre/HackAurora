import React, { useEffect, useState } from "react";
import { initializeBlockchain, produceProduct, getAllProducts } from "./Blockchain/Blockchain";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const handleProduceProduct = async () => {
    await produceProduct("Apple", "Fresh apple", 10, 100);
    fetchProducts();
  };

  const fetchProducts = async () => {
    const allProducts = await getAllProducts();
    setProducts(allProducts);
  };

  return (
    <div>
      <h1>Supply Chain</h1>
      <button onClick={handleProduceProduct}>Produce Product</button>
      <button onClick={fetchProducts}>Fetch Products</button>
      <ul>
        {products && Array.isArray(products) && products.map((product, index) => (
          <li key={index}>
            {product.productName} - {product.productDesc}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;