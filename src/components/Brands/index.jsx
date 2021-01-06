import React, { Component } from "react";
import "./brands.scss";
import { connect } from "react-redux";
import { categoryAction, brandAction } from "../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

import Brand from "./Brand";
import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    show: "card",
    loading: true,
    brands: [],
    brand_id: 0,
    top: "100px",
  };

  componentDidMount() {
    this.fetchBrands();

    window.addEventListener("scroll", () => {
      let scroll = window.scrollY;
      if (scroll > 0) {
        this.setState({ top: "65px" });
      } else {
        this.setState({ top: "100px" });
      }
    });
  }

  fetchBrands = async () => {
    var brandsArray = [];

    const brandsRef = firebase.firestore().collection("brands");
    await brandsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => brandsArray.push(doc.data()));
    });
    console.log("brand: ",brandsArray);

    this.setState({ brands: brandsArray, loading: false });
    localStorage.setItem("brands", JSON.stringify(brandsArray));
    this.props.brandAction(brandsArray);
  };

  

  render() {
    const {
      top,
      loading,
      show,
      brands,
      brand_id,
    } = this.state;
    return (
      <div className="products">
        <Header />
        <Navbar />

        <div className="wrapper">
          <Link to="/addbrand">
            <div style={{ top: top, transition: "0.5s" }} className="new">
              <i className="demo-icon icon-plus">&#xe808;</i>
            </div>
          </Link>

          <span>Brands</span>
          {// loading product
          loading ? (
            <div className={show}>
              {brands.map((num) => (
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
              brands.length === 0 ? (
                <span style={{ color: "red" }}>Empty</span>
              ) : (
                brands.map((brand) => (
                  <Brand key={brands.brand_id} brand={brand} />
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
