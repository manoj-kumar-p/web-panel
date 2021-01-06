import React, { Component } from "react";
import "./addbrand.scss";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import _, { reject } from "lodash";

import Header from "../Header";
import Navbar from "../Navbar";
import Loading from "../Loading";
import firebase from "../../init-firebase";

class AddBrand extends Component {
  state = {
    image: "",
    imagePreview: [],
    message: "",
    description: "",
    success: false,
    loading: false,
    brand_about: "",
    brand_origin: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleImage = async (e) => {
    let tempArray = [];
    let files = e.target.files;
    tempArray.push(files[0]);
    this.setState({
      imagePreview: tempArray,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { imagePreview, brand_name, brand_origin, brand_about } = this.state;
    const token = this.props.user.token;

    if (!brand_origin) this.setState({ message: "Submit origin" });
    if (!brand_about) this.setState({ message: "Submit about" });
    if (!brand_name) this.setState({ message: "Submit name" });
    if (imagePreview.length < 1) this.setState({ message: "Submit image" });

    this.setState({ messageadd: "" });

    if (imagePreview.length > 0 && brand_name && brand_about && brand_origin) {
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
      this.setState({ image: uploadUrls });
      console.log("state: ", this.state.image);
      //TODO
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfully added ",
          brand_name: "",
          brand_about: "",
          brand_origin: "",
          imagePreview: "",
          image: "",
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error ", e);
      };

      const brandsRef = firebase
        .firestore()
        .collection("brands")
        .doc();
      await brandsRef
        .set({
          brand_name,
          brand_origin,
          brand_about,
          brand_id: brandsRef.id,
          image: this.state.image[0],
        })
        .then(success)
        .catch(failure);
      console.log(brandsRef.id);
    }
  };

  render() {
    const {
      loading,
      imagePreview,
      message,

      brand_name,
      brand_origin,
      brand_about,
      success,
    } = this.state;
    var tempImages = [];
    return (
      <div className="add-wrapper">
        <Header />
        <Navbar />
        <Link to="/categories">
          <div className="cancel">
            <i className="demo-icon icon-cancel">&#xe80f;</i>
          </div>
        </Link>
        {loading ? <Loading /> : ""}

        <div className="add-product">
          <h1>Add Brand</h1>
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
              // multiple
            />
          </div>

          <form onSubmit={this.handleSubmit}>
            <label htmlFor="">Name</label>
            <input
              value={brand_name || ""}
              onChange={this.handleChange}
              name="brand_name"
              type="text"
            />
            <label htmlFor="">Origin</label>
            <input
              value={brand_origin || ""}
              onChange={this.handleChange}
              name="brand_origin"
              type="text"
            />
            <label htmlFor="">About</label>
            <input
              value={brand_about || ""}
              onChange={this.handleChange}
              name="brand_about"
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

export default connect(mapStateToProps)(AddBrand);
