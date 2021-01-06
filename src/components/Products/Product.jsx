import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Lazy } from "react-lazy";
import { price } from "../../config";

class Product extends Component {
  render() {
    const { product } = this.props;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={{ pathname: `product/${product.item_id}`, state: product }}
      >
        <div className="product">
          <div className="photo">
            <Lazy ltIE9>
              <img src={product.imageUrls[0]} alt="unavailable" />
            </Lazy>
          </div>
          <div className="name">
            <span>{product.name}</span>
          </div>
          <div className="code">
            <div>Description</div>
            <span>{product.description}</span>
          </div>
          <div className="price">
            <div>Price</div>{" "}
            <span>
              Rs{" "}
              {price(
                product.price !== undefined || null
                  ? product.price
                  : product.salePrice
              )}
            </span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Product;
