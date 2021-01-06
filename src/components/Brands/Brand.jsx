import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Lazy } from "react-lazy";
import { price } from "../../config";

class Brand extends Component {
  render() {
    const {brand } = this.props;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={{ pathname: `brand/${brand.brand_id}`, state: brand }}
      >
        <div className="product">
          <div className="photo">
            <Lazy ltIE9>
              <img src={brand.image} alt="unavailable" />
            </Lazy>
          </div>
          <div className="name">
            <span>{brand.brand_name}</span>
          </div>
          <div className="name">
            <span>{brand.brand_origin}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Brand;
