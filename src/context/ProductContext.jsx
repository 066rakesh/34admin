import { createContext, useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getAllProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.log("Failed to fetch products", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
