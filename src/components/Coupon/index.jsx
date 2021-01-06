import React, { Component } from "react";
import "./coupon.scss";
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
    coupon: "",
    comfirm_delete: true,
    message: "",
    loading: true,
    currentImageIndex: 0,
  };

  deleteCoupon(id) {
    firebase
      .firestore()
      .collection("coupons")
      .doc(id)
      .delete()
      .then((res) => {
        console.log("successfully deleted");
        this.props.history.push("/coupons");
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
        coupon: this.props.location.state,
        loading: false,
      });
    } else {
      let id = this.props.match.params.id;
      axios(url + "/coupon/" + id).then((res) => {
        if (res.data) {
          this.setState({
            coupon: res.data,
            loading: false,
          });
        }
      });
    }
  }

  render() {
    const { coupon, comfirm_delete, message, loading } = this.state;
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
                  this.deleteCoupon(
                    coupon.code == null ? coupon.id : coupon.code
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
              to="/categories"
            >
              Coupons
            </Link>{" "}
            <span>{" > " +coupon.code}</span>
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
                pathname: `/updatecoupon/${coupon.code}`,
                state: {coupon },
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
            <div className="detail">
              <span className="message">{message}</span>

              <div className="box">
                <div className="name">
                Code <br />
                  <span>{coupon.code}</span>
                </div>
                <div className="code">
                  Discount <br />
                  <span>{coupon.discount}</span>
                </div>
                <div className="code">
                  Minimum Amount <br />
                  <span>{coupon.validAbove}</span>
                </div>
                <div className="category">
                </div>
              </div>
            </div>
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
