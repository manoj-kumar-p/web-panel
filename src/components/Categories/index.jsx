import React, { Component } from "react";
import "./categories.scss";
import { connect } from "react-redux";
import { categoryAction, brandAction } from "../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

import Category from "./Category";
import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    show: "card",
    loading: true,
    categories: [],
    category_id: 0,
    top: "100px",
  };

  componentDidMount() {
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

  

  render() {
    const {
      top,
      loading,
      show,
      categories,
      category_id,
    } = this.state;
    return (
      <div className="products">
        <Header />
        <Navbar />

        <div className="wrapper">
          <Link to="/addcategory">
            <div style={{ top: top, transition: "0.5s" }} className="new">
              <i className="demo-icon icon-plus">&#xe808;</i>
            </div>
          </Link>

          <span>Categories</span>
          {// loading product
          loading ? (
            <div className={show}>
              {categories.map((num) => (
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
              categories.length === 0 ? (
                <span style={{ color: "red" }}>Empty</span>
              ) : (
                categories.map((category) => (
                  <Category key={category.category_id} category={category} />
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
