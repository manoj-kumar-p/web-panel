import React, { Component } from "react";
import "./coupons.scss";
import { connect } from "react-redux";
import { couponAction } from "../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

import Coupon from "./Coupon";
import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    show: "card",
    loading: true,
    coupons: [],
    code: 0,
    top: "100px",
  };

  componentDidMount() {
    this.fetchCoupons();

    window.addEventListener("scroll", () => {
      let scroll = window.scrollY;
      if (scroll > 0) {
        this.setState({ top: "65px" });
      } else {
        this.setState({ top: "100px" });
      }
    });
  }

  fetchCoupons = async () => {
    var couponsArray = [];
    var t_coupons = localStorage.getItem("coupons");
    if (t_coupons) {
      this.setState({ coupons: JSON.parse(t_coupons), loading: false });
    }

    const couponsRef = firebase.firestore().collection("coupons");
    await couponsRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => couponsArray.push(doc.data()));
    });
    console.log("coupon: ", couponsArray);

    this.setState({ coupons: couponsArray, loading: false });
    localStorage.setItem("coupons", JSON.stringify(couponsArray));
    this.props.couponAction(couponsArray);
  };

  render() {
    const { top, loading, show, coupons, code } = this.state;
    return (
      <div className="products">
        <Header />
        <Navbar />

        <div className="wrapper">
          <Link to="/addcoupon">
            <div style={{ top: top, transition: "0.5s" }} className="new">
              <i className="demo-icon icon-plus">&#xe808;</i>
            </div>
          </Link>

          <span>Coupons</span>
          {// loading product
          loading ? (
            <div className={show}>
              {coupons.map((num) => (
                <div key={num} className="loading-list">
                  <div />
                  <div />
                  <div />
                </div>
              ))}
            </div>
          ) : (
            <div className={show}>
              {//list all products
              coupons.length === 0 ? (
                <span style={{ color: "red" }}>Empty</span>
              ) : (
                coupons.map((coupon) => (
                  <Coupon key={coupon.code} coupon={coupon} />
                ))
              )}
            </div>
          )}
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

export default connect(
  mapStateToProps,
  { couponAction }
)(index);
