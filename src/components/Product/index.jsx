import React, { Component } from "react";
import "./product.scss";
import axios from "axios";
import { url, headers, price } from "../../config";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import firebase from "../../init-firebase";

import Header from "../Header";
import Navbar from "../Navbar";

class index extends Component {
  state = {
    product: "",
    comfirm_delete: true,
    message: "",
    loading: true,
    currentImageIndex: 0,
    category_name: "",
    brand_name: "",
  };

  deleteProduct(id) {
    firebase
      .firestore()
      .collection("products")
      .doc(id)
      .delete()
      .then((res) => {
        console.log("successfully deleted");
        this.props.history.push("/products");
        this.setState({ message: "Successfully deleted" });
      })
      .catch((err) => {
        console.log("failed to delete");
        this.setState({ message: "Failed delete", comfirm_delete: false });
      });
  }

  async componentDidMount() {
    if (this.props.location.state) {
      await this.setState({
        product: this.props.location.state,
        loading: false,
      });
      this.getCategoryName(this.state.product.category_id);
      this.getBrandName(this.state.product.brand_id);
      console.log("prod: ", this.state.product);
    } else {
      let id = this.props.match.params.id;
      axios(url + "/product/" + id).then((res) => {
        if (res.data) {
          this.setState({
            product: res.data,
            loading: false,
          });
        }
      });
    }
  }
  async getCategoryName(id) {
    if (id !== undefined) {
      var doc = await firebase
        .firestore()
        .collection("categories")
        .doc(id)
        .get();
      console.log("doc: ", doc.data());
      await this.setState({ category_name: doc.data().category_name });
    }
  }
  async getBrandName(id) {
    if (id !== undefined) {
      var doc = await firebase
        .firestore()
        .collection("brands")
        .doc(id)
        .get();
      console.log("doc: ", doc.data());
      await this.setState({ brand_name: doc.data().brand_name });
    }
  }

  render() {
    const { product, comfirm_delete, message, loading } = this.state;
    return (
      <div className="detail-product">
        <Header />
        <Navbar />

        {//open comfirm delete category
        comfirm_delete ? (
          ""
        ) : (
          <div className="comfirm-delete">
            <div>
              <h3>Are you sure want to delete?</h3>
              <button
                onClick={() => {
                  this.deleteProduct(
                    product.item_id == null ? product.id : product.item_id
                  );
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  this.setState({ comfirm_delete: true });
                }}
              >
                No
              </button>
            </div>
          </div>
        )}
        <div className="top">
          <div className="back">
            <Link
              style={{
                textDecoration: "none",
                color: "#4694fc",
                fontWeight: "400",
              }}
              to="/products"
            >
              Products
            </Link>{" "}
            <span>{" > " + product.name}</span>
          </div>

          <div className="action">
            <div
              onClick={() => {
                this.setState({ comfirm_delete: false });
              }}
              className="delete"
            >
              <i className="demo-icon icon-minus">&#xe814;</i>
            </div>
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: `/updateproduct/${product.item_id}`,
                state: { product },
              }}
            >
              <div className="update">
                <i className="demo-icon icon-cog">&#xe81a;</i>
              </div>
            </Link>
          </div>
        </div>
        <div>
          <div className="wrapper">
            <div className="image">
              {loading ? (
                <div className="load" />
              ) : (
                <img
                  src={
                    product.imageUrls !== undefined
                      ? product.imageUrls[this.state.currentImageIndex]
                      : product.images
                  }
                  style={{ height: "30em" }}
                  alt=""
                />
              )}
              {console.log("urls:", product.imageUrls)}
              <div style={{ textAlign: "center" }}>
                <h1
                  style={{ display: "inline", cursor: "pointer" }}
                  onClick={() => {
                    if (product.imageUrls !== undefined)
                      this.setState({
                        currentImageIndex:
                          Math.abs(--this.state.currentImageIndex) %
                          product.imageUrls.length,
                      });
                  }}
                >
                  {"<  "}
                </h1>
                <span>{this.state.currentImageIndex + 1}</span>
                <h1
                  style={{ display: "inline", cursor: "pointer" }}
                  onClick={() => {
                    if (product.imageUrls !== undefined)
                      this.setState({
                        currentImageIndex:
                          ++this.state.currentImageIndex %
                          product.imageUrls.length,
                      });
                  }}
                >
                  {"  >"}
                </h1>
              </div>
            </div>
            <div className="detail">
              <span className="message">{message}</span>

              <div className="box">
                <div className="name">
                  <span>{product.name}</span>
                </div>
                <div className="code">
                  Brand <br />
                  <span>{this.state.brand_name}</span>
                </div>
                <div className="category">
                  <div>
                    Category <br />
                    <span>{this.state.category_name}</span>
                  </div>
                  <div>
                    On Sale? <br />
                    <span>{product.inSale ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    Featured on homePage? <br />
                    <span>{product.isFeatured ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="weight">
                  Stock Left <br />
                  <span>{product.stockLeft} </span>
                </div>
                <div className="weight">
                  Original Price <br />
                  <span>
                    {product.originalPrice} 
                  </span>
                </div>
                <div className="weight">
                  Quality <br />
                  <span>
                    {product.quality} 
                  </span>
                </div>
              </div>

              <div className="price">
                Sale Price <br />
                <span>Rs {price(product.salePrice)}</span>
              </div>
            </div>
          </div>
          <div className="description">
            Description <br />
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(index);
