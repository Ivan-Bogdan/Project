import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./index";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [setProductBySell] = useState([]);
  const [productsByArrival, setProductByArrival] = useState([]);
  const [setError] = useState(false);

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <Layout
      title="Интернет-магазин методических пособий"
      description="Главная"
      className="container-fluid"
    >
      <Search />
      <h2 className="mb-4">Методические пособия</h2>
      <div className="row">
        {productsByArrival.map((product, i) => (
          <div key={i} className="col-3 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default Home;
