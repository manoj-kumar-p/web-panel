import React, { Component } from "react";
import "./addcategory.scss";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import _, { reject } from "lodash";

import Header from "../Header";
import Navbar from "../Navbar";
import Loading from "../Loading";
import firebase from "../../init-firebase";

class AddCategory extends Component {
  state = {
    images: "",
    imagePreview: [],
    message: "",
    description: "",
    success: false,
    loading: false,
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
    const { imagePreview, category_name } = this.state;
    const token = this.props.user.token;

    if (!category_name) this.setState({ message: "Submit name" });
    if (imagePreview.length < 1) this.setState({ message: "Submit image" });

    this.setState({ messageadd: "" });

    if (imagePreview.length > 0 && category_name) {
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
      this.setState({ images: uploadUrls });
      console.log("state: ", this.state.images);
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfully added product",
          category_name: "",
          imagePreview: "",
          images: "",
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error ", e);
      };

      const categoriesRef = firebase
        .firestore()
        .collection("categories")
        .doc();
      await categoriesRef
        .set({
          category_name,
          category_id: categoriesRef.id,
          images: this.state.images[0],
        })
        .then(success)
        .catch(failure);
      console.log(categoriesRef.id);
    }
  };

  render() {
    const {
      loading,
      imagePreview,
      message,

      category_name,
      success,
    } = this.state;
    var tempImages = "";
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
          <h1>Add Category</h1>
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
              value={category_name || ""}
              onChange={this.handleChange}
              name="category_name"
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

export default connect(mapStateToProps)(AddCategory);
