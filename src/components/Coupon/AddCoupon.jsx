import React, { Component } from "react";
import "./addcoupon.scss";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import _, { reject } from "lodash";

import Header from "../Header";
import Navbar from "../Navbar";
import Loading from "../Loading";
import firebase from "../../init-firebase";

class AddCoupon extends Component {
  state = {
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



  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      code,
      discount,
      validAbove,
    } = this.state;

    if (!code) this.setState({ message: "Submit code" });
    if (!discount) this.setState({ message: "Submit discount amount" });
    if (!validAbove) this.setState({ message: "Submit minimum value" });
    
    this.setState({ messageadd: "" });

    if (
     code&&
     discount&&
     validAbove
    ) {
      this.setState({ loading: true });
      const success = () =>
        this.setState({
          loading: false,
          message: "Successfull",
          code: "",
          discount:"" ,
          validAbove: "",
        });

      const failure = (e) => {
        this.setState({
          loading: false,
          message: "Failed ",
        });
        console.log("error ", e);
      };

      const couponsRef = firebase
        .firestore()
        .collection("coupons")
        .doc(code);
      await couponsRef
        .set({
          code,
          discount:parseInt(discount),
          validAbove:parseInt(validAbove)
        })
        .then(success)
        .catch(failure);
      console.log(couponsRef.id);
    }
  };

  render() {
    const {
      loading,
      message,

      code,
      discount,
      validAbove,
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

        <div className="add-coupon">
          <h1>Add Coupon</h1>
          {success ? (
            <div className="success">
              <div>Success</div>
            </div>
          ) : (
            ""
          )}
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="">Code</label>
            <input
              value={code || ""}
              onChange={this.handleChange}
              name="code"
              type="text"
            />
            <label htmlFor="">Discount</label>
            <input
              value={discount || ""}
              onChange={this.handleChange}
              name="discount"
              type="integer"
            />
            <label htmlFor="">ValidAbove</label>
            <input
              value={validAbove || ""}
              onChange={this.handleChange}
              name="validAbove"
              type="integer"
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
    coupons: state.couponsReducer,
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(AddCoupon);
