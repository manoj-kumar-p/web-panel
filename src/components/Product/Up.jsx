import React, { Component } from "react";
import "./addproduct.scss";
import axios from "axios";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { url, headers } from "../../config";
import { connect } from "react-redux";
import _ from "lodash";

import Header from "../Header";
import Navbar from "../Navbar";
import Loading from "../Loading";
import firebase from "../../init-firebase";

class Up extends Component {
  state = {
    categories: [],
    brands: [],
    imagePreview: "",
    // imageUrls: [], //todo
    message: "",
    description: "",
    success: false,
    loading: false,
    name: this.props.location.state.product.name,
    imageUrls: this.props.location.state.product.imageUrls,
    item_id: this.props.location.state.product.item_id,
    category_id: this.props.location.state.product.category_id,
    brand_id: this.props.location.state.product.brand_id,
    salePrice: this.props.location.state.product.salePrice,
    originalPrice: this.props.location.state.product.originalPrice,
    inSale: this.props.location.state.product.inSale,
    isFeatured: this.props.location.state.product.isFeatured,
    stockLeft: this.props.location.state.product.stockLeft,
    description: this.props.location.state.product.description,
  };

  async componentDidMount() {
    console.log(this.props.location.state.product);
    let categories = this.props.categories.data;
    if (_.isArray(categories)) {
      this.setState({ categories });
    }
    let brands = await this.props.brands.data;
    if (_.isArray(brands)) {
      this.setState({ brands });
    }
    console.log(brands, categories);
  }

  selectCategory = (e) => {
    this.setState({
      category_id: e.target.value,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleImage = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreview: reader.result,
      });
    };
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      item_id,
      imagePreview,
      file,
      name,
      imageUrls,
      category_id,
      brand_id,
      salePrice,
      originalPrice,
      inSale,
      isFeatured,
      stockLeft,
      description,
    } = this.state;
    const token = this.props.user.token;
    console.log("state:", this.state);
    if (!description) this.setState({ message: "Submit description" });
    if (!salePrice) this.setState({ message: "Submit salePrice" });
    if (!originalPrice) this.setState({ message: "Sumbit original price" });
    if (!category_id) this.setState({ message: "Select category" });
    if (!brand_id) this.setState({ message: "Select brand" });
    if (!name) this.setState({ message: "Submit name" });
    if (!inSale) this.setState({ message: "Submit inSale" });
    if (!isFeatured) this.setState({ message: "Submit isFeatured" });
    if (!stockLeft) this.setState({ message: "Submit isFeatured" });
    

    // if (!imagePreview) this.setState({ message: "Submit image" });

    this.setState({ messageadd: "" });

    if (
      // imagePreview &&
      description &&
      salePrice &&
      originalPrice &&
      category_id &&
      brand_id &&
      name &&
      inSale &&
      isFeatured &&
      stockLeft 
    ) {
      this.setState({ loading: true });
      let data = new FormData();
      data.append("image", file);
      //TODO
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfully updated product",
          description: "",
          salePrice: "",
          originalPrice: "",
          category_id: "",
          brand_id: "",
          name: "",
          inSale: "",
          isFeatured: "",
          stockLeft: "",
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed to update product",
        });
        console.log("error updating product ", e);
      };

      const productsRef = firebase
        .firestore()
        .collection("products")
        .doc(item_id);
      await productsRef
        .update({
          name,
          imageUrls,
          salePrice,
          category_id,
          description,
          inSale,
          isFeatured,
          originalPrice,
        })
        .then(success)
        .catch(failure);
      console.log(productsRef.id);
    }
  };

  render() {
    const {
      loading,
      imagePreview,
      message,

      categories,
      category_id,
      brands,
      brand_id,
      name,
      salePrice,
      originalPrice,
      stockLeft,
      inSale,
      isFeatured,
      description,
      success,
    } = this.state;
    return (
      <div className="add-wrapper">
        <Header />
        <Navbar />
        <Link to="/products">
          <div className="cancel">
            <i className="demo-icon icon-cancel">&#xe80f;</i>
          </div>
        </Link>
        {loading ? <Loading /> : ""}

        <div className="add-product">
          <h1>Update Product</h1>
          {success ? (
            <div className="success">
              <div>Success</div>
            </div>
          ) : (
            ""
          )}

          <div className="photo">
            <div className="image">
              {imagePreview ? (
                <img src={imagePreview} alt="imagePreview" />
              ) : (
                <div />
              )}
            </div>
            <label htmlFor="photo">
              Image <i className="demo-icon icon-picture">&#xe812;</i>
            </label>
            <br />
            <input
              onChange={this.handleImage}
              id="photo"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
            />
          </div>

          <form onSubmit={this.handleSubmit}>
            <label htmlFor="">Name</label>
            <input
              value={name || ""}
              onChange={this.handleChange}
              name="name"
              type="text"
            />
            <label htmlFor="">Category</label>
            <select
              value={category_id}
              onChange={this.selectCategory}
              name="category_id"
              id="category"
            >
              <option value="">select</option>
              {categories.map((category) => {
                return (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="">Brand</label>
            <select
              value={brand_id}
              onChange={this.handleChange}
              name="brand_id"
              id="brand"
            >
              <option value="">select</option>
              {brands.map((brand) => {
                return (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="">Original Price</label>
            <input
              value={originalPrice}
              placeholder="Rs"
              onChange={this.handleChange}
              name="originalPrice"
              type="text"
            />
            <label htmlFor="">Sale Price</label>
            <input
              value={salePrice}
              placeholder="Rs"
              onChange={this.handleChange}
              name="salePrice"
              type="text"
            />
            <label htmlFor="">Stock Left</label>
            <input
              value={stockLeft}
              placeholder=""
              onChange={this.handleChange}
              name="stockLeft"
              type="text"
            />
            <label htmlFor="">In Sale ?</label>
            <select
              value={inSale}
              onChange={this.handleChange}
              name="inSale"
              id="inSale"
            >
              <option value="">Select</option>

              <option key={"yes"} value={true}>
                Yes
              </option>
              <option key={"no"} value={false}>
                No
              </option>
            </select>
            <label htmlFor="">is Featured ?</label>

            <select
              value={isFeatured}
              onChange={this.handleChange}
              name="isFeatured"
              id="isFeatured"
            >
              <option value="">Select</option>

              <option key={"yes"} value={true}>
                Yes
              </option>
              <option key={"no"} value={false}>
                No
              </option>
            </select>
            <label htmlFor="description">Description</label>

            <ReactQuill
              className="description"
              value={description || ""}
              onChange={(value) => this.setState({ description: value })}
              id="description"
            />

            <span className="message">{message}</span>
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categoriesReducer,
    brands: state.brandsReducer,
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(Up);
