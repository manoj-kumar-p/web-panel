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

class Upd extends Component {
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
    description: this.props.location.state.product.description.join("*"),
    features: this.props.location.state.product.features.join("*"),
    hasSize: this.props.location.state.product.hasSize,
    wings: this.props.location.state.product.wings,
    quality: this.props.location.state.product.quality,
    sizes:
      this.props.location.state.product.sizes == null ||
      this.props.location.state.product.sizes == undefined
        ? ""
        : this.props.location.state.product.sizes.join(","),
  };

  async componentDidMount() {
    this.getImages();
    let categories = this.props.categories.data;
    if (_.isArray(categories)) {
      this.setState({ categories });
    }
    let brands = this.props.brands.data;
    if (_.isArray(brands)) {
      this.setState({ brands });
    }
    if (categories.length < 1) {
      var t_categories = localStorage.getItem("categories");
      var t_brands = localStorage.getItem("brands");
      if (t_categories) {
        this.setState({ categories: JSON.parse(t_categories) });
      }
      if (t_brands) {
        this.setState({ brands: JSON.parse(t_brands) });
      }
    }
  }
  async getImages() {
    var tempBlobs = [];
    console.log("function");
    console.log(this.state.imageUrls);
    this.state.imageUrls.forEach((url) => {
      console.log("inside function");
      console.log(url);
      fetch(url)
        .then(function(response) {
          return response.blob();
        })
        .then(function(blob) {
          tempBlobs.push(blob);
        })
        .catch((e) => console.log("error happened getting image blobs"));
      if (tempBlobs.length == this.state.imageUrls) {
        this.setState({ imagePreview: tempBlobs });
        console.log("done getting images");
      }
    });
  }

  selectCategory = (e) => {
    this.setState({
      category_id: e.target.value,
    });
  };

  handleChange = async (e) => {
    await this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(this.state.hasSize);
  };

  handleImage = async (e) => {
    let tempArray = [];
    let files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      tempArray.push(files[i]);
    }

    this.setState({
      imagePreview: tempArray,
    });
  };
  handleSuccess = () => {
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
      imagePreview: [],
      imageUrls: [],
      features: "",
      wings: "",
      sizes: "",
      hasSize: false,
      quality: "",
    });
    this.props.history.push("/products");
  };

  handleFailure = (e) => {
    this.setState({
      loading: false,
      message: "Failed to update product",
    });
    console.log("error updating product ", e);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      imagePreview,
      imageUrls,
      name,
      category_id,
      brand_id,
      salePrice,
      originalPrice,
      inSale,
      isFeatured,
      stockLeft,
      description,
      features,
      hasSize,
      wings,
      quality,
      sizes,
      item_id,
    } = this.state;
    const token = this.props.user.token;

    if (!description) this.setState({ message: "Submit description" });
    if (!salePrice) this.setState({ message: "Submit salePrice" });
    if (!originalPrice) this.setState({ message: "Select brand" });
    if (!category_id) this.setState({ message: "Select category" });
    if (!brand_id) this.setState({ message: "Select brand" });
    if (!name) this.setState({ message: "Submit name" });
    if (!inSale) this.setState({ message: "Submit inSale" });
    if (!isFeatured) this.setState({ message: "Submit isFeatured" });
    if (!stockLeft) this.setState({ message: "Submit isFeatured" });
    if (imageUrls.length < 1) this.setState({ message: "Submit image" });
    if (!wings) this.setState({ message: "Enter wings" });
    if (!quality) this.setState({ message: "Enter quality" });
    if (!features) this.setState({ message: "Enter features" });
    if (hasSize && !sizes)
      this.setState({
        message: "Enter size",
      });

    this.setState({ messageadd: "" });
    // return;

    if (
      imageUrls.length > 0 &&
      description &&
      salePrice &&
      originalPrice &&
      category_id &&
      brand_id &&
      name &&
      inSale &&
      isFeatured &&
      stockLeft &&
      wings &&
      quality &&
      features &&
      (hasSize && !sizes).toString() === "false"
    ) {
      this.setState({ loading: true });
      if (imagePreview.length > 0) {
        var uploadUrls = await new Promise((resolve, reject) => {
          let tempUrls = [];
          try {
            imagePreview.forEach(async (e) => {
              var uploadTask = await firebase
                .storage()
                .ref("sample/" + Date.now().toString() + e.name)
                .put(e);
              var url = await uploadTask.ref.getDownloadURL();
              tempUrls.push(url);
              if (tempUrls.length == imagePreview.length) resolve(tempUrls);
            });
          } catch (error) {
            reject(new Error("error happened while uploading"));
          }
        });
        console.log("upUrls: ", uploadUrls);
        this.setState({ imageUrls: uploadUrls });
        console.log("state: ", this.state.imageUrls);
      }
      //TODO
      const productsRef = firebase
        .firestore()
        .collection("products")
        .doc(item_id);
      await productsRef
        .update({
          name, //
          imageUrls: this.state.imageUrls, //done
          salePrice: parseInt(salePrice),
          brand_id, //
          category_id, //
          description: description.split("*"), //
          inSale: inSale.toString() === "true" ? true : false,
          isFeatured: isFeatured.toString() === "true" ? true : false,
          originalPrice: parseInt(originalPrice),
          stockLeft: parseInt(stockLeft),
          features: features.split("*"), //
          wings,
          sizes: sizes == null || sizes == undefined ? null : sizes.split(","),
          hasSize: hasSize.toString() === "true" ? true : false,
          quality, //
        })
        .then(() => this.handleSuccess())
        .catch(this.handleFailure);
      console.log(productsRef.id);
      // this.setState({ loading: false });
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
      hasSize,
      sizes,
      features,
      wings,
      quality,
    } = this.state;
    var tempImages = [];
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
              {imagePreview.length > 0 ? (
                <>
                  {
                    ((tempImages = []),
                    imagePreview.forEach((e) => {
                      tempImages.push(
                        <img
                          key={e.name}
                          src={URL.createObjectURL(e)}
                          style={{ height: "10em", width: "10em" }}
                          alt="imagePreview"
                        />
                      );
                    }))
                  }
                  <>{tempImages}</>
                </>
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
              accept="image/x-png,image/gif,image/jpeg, .jpg"
              multiple
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
              <option value="">Select</option>
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
              <option value="">Select</option>
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
              type="number"
            />
            <label htmlFor="">Wings</label>
            <input
              value={wings}
              placeholder=""
              onChange={this.handleChange}
              name="wings"
              type="text"
            />
            <label htmlFor="">Quality</label>
            <input
              value={quality}
              placeholder=""
              onChange={this.handleChange}
              name="quality"
              type="text"
            />
            <label htmlFor="">has Size ?</label>
            <select
              value={hasSize}
              onChange={this.handleChange}
              name="hasSize"
              id="hasSize"
            >
              <option key={"yes"} value={true}>
                Yes
              </option>
              <option key={"no"} value={false}>
                No
              </option>
            </select>
            {this.state.hasSize.toString() === "true" ? (
              <>
                <label htmlFor="">Size</label>
                <input
                  value={sizes}
                  placeholder="Enter sizes separated by a comma"
                  onChange={this.handleChange}
                  name="sizes"
                  type="text"
                />
              </>
            ) : (
              <label />
            )}
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
            <label htmlFor="">Is Featured ?</label>

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
            <textarea
              value={
                description // className="description"
              }
              style={{ height: "10em" }}
              placeholder="Enter description separated by * to make a bullet point"
              onChange={this.handleChange}
              name="description"
              id="description"
              type="text"
            />
            {/* <ReactQuill
              className="description"
              value={description || ""}
              onChange={(value) => this.setState({ description: value })}
              id="description"
            /> */}
            <label htmlFor="features">Features</label>
            <textarea
              value={
                features // className="description"
              }
              style={{ height: "10em" }}
              placeholder="Enter features separated by * to make a bullet point"
              onChange={this.handleChange}
              name="features"
              id="features"
              type="text"
            />

            <span className="message">{message}</span>
            <button type="submit">Save</button>
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

export default connect(mapStateToProps)(Upd);
