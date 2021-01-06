import React, { Component } from "react";
import "./products.scss";
import { connect } from "react-redux";
import { categoryAction, brandAction } from "../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

import Product from "./Product";
import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    show: "card",
    loading: true,
    products: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    categories: [],
    brands: [],
    category_id: 0,
    brand_id: 0,
    top: "100px",
    search: "",
  };

  componentDidMount() {
    this.fetchProducts();
    this.fetchBrands();
    let category = localStorage.getItem("categories");
    if (_.isString(category)) {
      let categories = JSON.parse(category);
      if (_.isArray(categories)) this.setState({ categories, loading: false });
    }
    this.fetchCategories();

    window.addEventListener("scroll", () => {
      let scroll = window.scrollY;
      if (scroll > 0) {
        this.setState({ top: "65px" });
      } else {
        this.setState({ top: "100px" });
      }
    });
  }

  fetchCategories = async () => {
    var categoriesArray = [];

    const categoriesRef = firebase.firestore().collection("categories");
    await categoriesRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => categoriesArray.push(doc.data()));
    });
    console.log("cat: ", categoriesArray);

    this.setState({ categories: categoriesArray, loading: false });
    localStorage.setItem("categories", JSON.stringify(categoriesArray));
    this.props.categoryAction(categoriesArray);
  };

  fetchProducts = async () => {
    let products = JSON.parse(localStorage.getItem("products"));
    if (_.isArray(products)) {
      this.setState({ products, loading: false });
    }

    var productsArray = [];

    const productsRef = firebase.firestore().collection("products");
    await productsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => productsArray.push(doc.data()));
    });
    console.log(productsArray);
    this.setState({ products: productsArray, loading: false });
    localStorage.setItem("products", JSON.stringify(productsArray));
  };

  selectCategory = (e) => {
    let id = e.target.value;

    this.setState({ category_id: id, brand_id: 0 });
    if (id <= 0) {
      this.fetchProducts();
    } else {
      this.fetchProductsCategory(id);
    }
  };
  async fetchBrands() {
    let brands = JSON.parse(localStorage.getItem("brands"));
    if (_.isArray(brands)) {
      this.setState({ brands, loading: false });
    }

    var brandsArray = [];

    const brandsRef = firebase.firestore().collection("brands");
    await brandsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => brandsArray.push(doc.data()));
    });
    console.log("brands Array: ", brandsArray);
    this.setState({ brands: brandsArray, loading: false });
    localStorage.setItem("brands", JSON.stringify(brandsArray));
    this.props.brandAction(brandsArray);
  }

  async fetchProductsCategory(id) {
    let products = JSON.parse(localStorage.getItem(`category${id}`));
    if (_.isArray(products)) {
      this.setState({ products, loading: false });
    }

    var productsArray = [];

    const productsRef = await firebase
      .firestore()
      .collection("products")
      .where("category_id", "==", id);
    await productsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => {
        productsArray.push(doc.data());
      });
    });
    console.log(productsArray);
    this.setState({ products: productsArray, loading: false });
  }
  async fetchProductsBrands(id) {
    let products = JSON.parse(localStorage.getItem(`category${id}`));
    if (_.isArray(products)) {
      this.setState({ products, loading: false });
    }

    var productsArray = [];

    const productsRef = await firebase
      .firestore()
      .collection("products")
      .where("brand_id", "==", id);
    await productsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => {
        productsArray.push(doc.data());
      });
    });
    console.log(productsArray);
    this.setState({ products: productsArray, loading: false });
  }

  selectBrand = (e) => {
    let id = e.target.value;
    let category = this.state.category_id;
    this.setState({ brand_id: id, category_id: 0 });
    if (id <= 0) {
      this.fetchProducts();
    } else {
      this.fetchProductsBrands(id);
    }
  };

  searchProduct = async (e) => {
    e.preventDefault();
    let productsArray = [];
    const updateProducts = (products) => this.setState({ products });
    const query = firebase
      .firestore()
      .collection("products")
      // .where("searchKeyWords", "array-contains", this.state.search);
      // .where("isFeatured", "==", "true");
      .where("searchKeyWords", "array-contains", "fall");
    await query
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          console.log("empty");
        }
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
          productsArray.push(doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      })
      .finally(() => {
        updateProducts(productsArray);
      });

    console.log("search :", productsArray);
  };

  render() {
    const {
      top,
      loading,
      products,
      show,
      categories,
      brands,
      brand_id,
      category_id,
      message,
    } = this.state;
    return (
      <div className="products">
        <Header />
        <Navbar />

        <div className="wrapper">
          <Link to="/addproduct">
            <div style={{ top: top, transition: "0.5s" }} className="new">
              <i className="demo-icon icon-plus">&#xe808;</i>
            </div>
          </Link>

          <span>Products</span>

          <div className="show">
            <div
              className={show === "card" ? "active" : ""}
              onClick={() => this.setState({ show: "card" })}
            >
              <span>Card View</span>
            </div>
            <div
              className={show === "table" ? "active" : ""}
              onClick={() => this.setState({ show: "table" })}
            >
              <span>Table View</span>
            </div>
          </div>

          <div className="wrapper-search">
            <div className="search">
              <label style={{ marginRight: "27px" }} htmlFor="category">
                Category
              </label>
              <select
                value={category_id}
                onChange={this.selectCategory}
                name="category"
                id="category"
              >
                <option value="0">All</option>
                {categories &&
                  categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="search">
              <label htmlFor="brand">Brands</label>
              <select
                value={brand_id}
                onChange={this.selectBrand}
                name="brand"
                id="brand"
              >
                <option value="0">All</option>
                {brands &&
                  brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="search-input">
              <form onSubmit={this.searchProduct}>
                <input
                  placeholder="Search product"
                  onChange={(e) => this.setState({ search: e.target.value })}
                  type="search"
                />
                <button type="submit">
                  <i className="demo-icon icon-search">&#xe806;</i>
                </button>
              </form>
            </div>
          </div>

          {// loading product
          loading ? (
            <div className={show}>
              {products.map((num) => (
                <div key={num} className="loading-list">
                  <div />
                  <div />
                  <div />
                </div>
              ))}
            </div>
          ) : (
            <div className={show}>
              {//list all products
              products.length === 0 ? (
                <span style={{ color: "red" }}>Empty</span>
              ) : (
                products.map((product) => (
                  <Product key={product.product_id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categoriesReducer,
    user: state.userReducer,
  };
};

export default connect(
  mapStateToProps,
  { categoryAction, brandAction }
)(index);
