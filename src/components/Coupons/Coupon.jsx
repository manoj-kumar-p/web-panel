import React, { Component } from "react";
import { Link } from "react-router-dom";

class Coupon extends Component {
  render() {
    const { coupon } = this.props;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={{ pathname: `coupon/${coupon.code}`, state: coupon }}
      >
        <div className="product">
          <div className="name">
            <span>Code: {coupon.code}</span>
          </div>
          <div className="name">
            <span>Discount: {coupon.discount}</span>
          </div>
          <div className="name">
            <span>Minimum Value {coupon.validAbove}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Coupon;
