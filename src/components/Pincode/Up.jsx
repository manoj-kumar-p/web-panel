import React, { Component } from "react";
import "./addpincode.scss";
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
    pincode: this.props.location.state.pincode.pincode,
    charge: this.props.location.state.pincode.charge,
  };


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };


  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      pincode,
      charge,
      file,
    } = this.state;
    const token = this.props.user.token;
    console.log("state:", this.state);
    if (!pincode) this.setState({ message: "Submit pincode" });
    if (!charge) this.setState({ message: "Submit amount" });
    this.setState({ messageadd: "" });

    if (
      pincode&&
      charge
    ) {
      this.setState({ loading: true });
      let data = new FormData();
      data.append("image", file);
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfull ",
          pincode: "",
         charge: "",
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error  ", e);
      };

      const pincodesRef = firebase
        .firestore()
        .collection("pincodes")
        .doc(pincode);
      await  pincodesRef
        .update({
          pincode,
          charge:parseInt(charge)
        })
        .then(success)
        .catch(failure);
      console.log(pincodesRef.id);
    }
  };

  render() {
    const {
      loading,
      message,

      pincode,
      charge,
      success,
    } = this.state;
    return (
      <div className="add-wrapper">
        <Header />
        <Navbar />
        <Link to="/coupons">
          <div className="cancel">
            <i className="demo-icon icon-cancel">&#xe80f;</i>
          </div>
        </Link>
        {loading ? <Loading /> : ""}

        <div className="add-product">
          <h1>Update</h1>
          {success ? (
            <div className="success">
              <div>Success</div>
            </div>
          ) : (
            ""
          )}


          <form onSubmit={this.handleSubmit}>
            <label htmlFor="">Pincode</label>
            <input
              value={pincode || ""}
              onChange={this.handleChange}
              name="pincode"
              type="text"
            />
            <label htmlFor="">Charge</label>
            <input
              value={charge || ""}
              onChange={this.handleChange}
              name="charge"
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
   coupons: state.couponsReducer,
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(Up);
