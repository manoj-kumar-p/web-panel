import React, { Component } from "react";
import "./category.scss";
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
    category: "",
    comfirm_delete: true,
    message: "",
    loading: true,
    currentImageIndex: 0,
  };

  deleteCategory(id) {
    firebase
      .firestore()
      .collection("categories")
      .doc(id)
      .delete()
      .then((res) => {
        console.log("successfully deleted");
        this.props.history.push("/categories");
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
        category: this.props.location.state,
        loading: false,
      });
    } else {
      let id = this.props.match.params.id;
      axios(url + "/category/" + id).then((res) => {
        if (res.data) {
          this.setState({
            category: res.data,
            loading: false,
          });
        }
      });
    }
  }

  render() {
    const { category, comfirm_delete, message, loading } = this.state;
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
                  this.deleteCategory(
                    category.category_id == null ? category.id : category.category_id
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
              Categories
            </Link>{" "}
            <span>{" > " + category.category_name}</span>
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
                pathname: `/updatecategory/${category.category_id}`,
                state: {category },
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
            <div className="image">
             
            <span><img src={category.images}></img></span>
            </div>
            <div className="detail">
              <span className="message">{message}</span>

              <div className="box">
                <div className="name">
                Id <br />
                  <span>{category.category_id}</span>
                </div>
                <div className="code">
                  Name <br />
                  <span>{category.category_name}</span>
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
