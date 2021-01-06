import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Lazy } from "react-lazy";
import { price } from "../../config";

class Category extends Component {
  render() {
    const { category } = this.props;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={{ pathname: `category/${category.category_id}`, state: category }}
      >
        <div className="product">
          <div className="photo">
            <Lazy ltIE9>
              <img src={category.images} alt="unavailable" />
            </Lazy>
          </div>
          <div className="name">
            <span>{category.category_name}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Category;
