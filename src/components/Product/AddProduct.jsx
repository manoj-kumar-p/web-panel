import React, { Component } from "react";
import "./addproduct.scss";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import _, { reject } from "lodash";

import Header from "../Header";
import Navbar from "../Navbar";
import Loading from "../Loading";
import firebase from "../../init-firebase";

class AddProduct extends Component {
  state = {
    categories: [],
    brands: [],
    imagePreview: [],
    imageUrls: [], //todo
    message: "",
    description: "",
    success: false,
    loading: false,
  };

  async componentDidMount() {
    let categories = this.props.categories.data;
    if (_.isArray(categories)) {
      this.setState({ categories });
    }
    let brands = await this.props.brands.data;
    if (_.isArray(brands)) {
      this.setState({ brands });
    }
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

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      imagePreview,
      name,
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

    if (!description) this.setState({ message: "Submit description" });
    if (!salePrice) this.setState({ message: "Submit salePrice" });
    if (!originalPrice) this.setState({ message: "Select brand" });
    if (!category_id) this.setState({ message: "Select category" });
    if (!brand_id) this.setState({ message: "Select brand" });
    if (!name) this.setState({ message: "Submit name" });
    if (!inSale) this.setState({ message: "Submit inSale" });
    if (!isFeatured) this.setState({ message: "Submit isFeatured" });
    if (!stockLeft) this.setState({ message: "Submit isFeatured" });
    if (imagePreview.length < 1) this.setState({ message: "Submit image" });

    this.setState({ messageadd: "" });

    if (
      imagePreview.length > 0 &&
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
      //TODO
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfully added product",
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
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed to add product",
        });
        console.log("error adding product ", e);
      };

      const productsRef = firebase
        .firestore()
        .collection("products")
        .doc();
      await productsRef
        .set({
          name,
          item_id: productsRef.id,
          imageUrls: this.state.imageUrls,
          salePrice,
          brand_id,
          category_id,
          description,
          inSale,
          isFeatured,
          originalPrice,
          stockLeft,
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
          <h1>Add Product</h1>
          {success ? (
            <div className="success">
              <div>Success</div>
            </div>
          ) : (
            ""
          )}

          <div className="photo">
            <div
              className="image"
              
            >
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

            <ReactQuill
              className="description"
              value={description || ""}
              onChange={(value) => this.setState({ description: value })}
              id="description"
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

export default connect(mapStateToProps)(AddProduct);
