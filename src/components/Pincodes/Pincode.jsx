import React, { Component } from "react";
import { Link } from "react-router-dom";

class Pincode extends Component {
  render() {
    const { pincode } = this.props;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={{ pathname: `pincode/${pincode.pincode}`, state: pincode }}
      >
        <div className="product">
          <div className="name">
            <span>Pincode: {pincode.pincode}</span>
          </div>
          <div className="name">
            <span>Charges: {pincode.charge}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Pincode;
