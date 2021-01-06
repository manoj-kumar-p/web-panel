import React, { Component } from "react";
import "./addcategory.scss";
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

class UpdateCategory extends Component {
  state = {
    message: "",
    success: false,
    loading: false,
    category_name: this.props.location.state.category.category_name,
    category_id: this.props.location.state.category.category_id,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { category_name, category_id, file } = this.state;
    const token = this.props.user.token;
    console.log("state:", this.state);
    if (!category_name) this.setState({ message: "Submit name" });
    this.setState({ messageadd: "" });

    if (category_name && category_id) {
      this.setState({ loading: true });
      let data = new FormData();
      data.append("image", file);
      const success = () => {
        this.setState({
          loading: false,
          message: "Successfull ",
          category_name: "",
          category_id: "",
        });
        this.props.history.push("/categories");
      };

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error  ", e);
      };

      const categoriesRef = firebase
        .firestore()
        .collection("categories")
        .doc(category_id);
      await categoriesRef
        .update({
          category_name,
        })
        .then(success)
        .catch(failure);
      console.log(categoriesRef.id);
    }
  };

  render() {
    const {
      loading,
      message,

      category_name,
      success,
    } = this.state;
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
          <h1>Update Category</h1>
          {success ? (
            <div className="success">
              <div>Success</div>
            </div>
          ) : (
            ""
          )}

          <form onSubmit={this.handleSubmit}>
            <label htmlFor="">Name</label>
            <input
              value={category_name || ""}
              onChange={this.handleChange}
              name="category_name"
              type="text"
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
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(UpdateCategory);
