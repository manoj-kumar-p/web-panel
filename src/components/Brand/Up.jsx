import React, { Component } from "react";
import "./addbrand.scss";
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
    message: "",
    description: "",
    success: false,
    loading: false,
    brand_id:this.props.location.state.brand.brand_id,
    brand_name: this.props.location.state.brand.brand_name,
    brand_origin: this.props.location.state.brand.brand_origin,
    brand_about: this.props.location.state.brand.brand_about,
    image: this.props.location.state.brand.image,
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
      brand_name,
      brand_id,
      brand_origin,
      brand_about,
      file,
    } = this.state;
    const token = this.props.user.token;
    console.log("state:", this.state);
    if (!brand_name) this.setState({ message: "Submit name" });
    if (!brand_origin) this.setState({ message: "Submit origin" });
    if (!brand_about) this.setState({ message: "Submit about" });
    this.setState({ messageadd: "" });

    if (
      brand_name &&
      brand_origin&&
      brand_about&&
      brand_id
    ) {
      this.setState({ loading: true });
      let data = new FormData();
      data.append("image", file);
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfully ",
          brand_name: "",
          brand_origin:"",
          brand_about:"",
          brand_id:""
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error  ", e);
      };

      const brandsRef = firebase
        .firestore()
        .collection("brands")
        .doc( brand_id);
      await  brandsRef
        .update({
          brand_name,
          brand_origin,
          brand_about,
        })
        .then(success)
        .catch(failure);
      console.log(brandsRef.id);
    }
  };

  render() {
    const {
      loading,
      message,

      brand_name,
      brand_origin,
      brand_about,
      success,
    } = this.state;
    return (
      <div className="add-wrapper">
        <Header />
        <Navbar />
        <Link to="/brands">
          <div className="cancel">
            <i className="demo-icon icon-cancel">&#xe80f;</i>
          </div>
        </Link>
        {loading ? <Loading /> : ""}

        <div className="add-product">
          <h1>Update Brand</h1>
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
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    
    brands: state.brandsReducer,
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(Up);
