import React, { Component } from "react";
import "./pincode.scss";
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
   pincode: "",
    comfirm_delete: true,
    message: "",
    loading: true,
    currentImageIndex: 0,
  };

  deletePincode(id) {
    firebase
      .firestore()
      .collection("pincodes")
      .doc(id)
      .delete()
      .then((res) => {
        console.log("successfully deleted");
        this.props.history.push("/pincodes");
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
        pincode: this.props.location.state,
        loading: false,
      });
    } else {
      let id = this.props.match.params.id;
      axios(url + "/pincode/" + id).then((res) => {
        if (res.data) {
          this.setState({
            pincode: res.data,
            loading: false,
          });
        }
      });
    }
  }

  render() {
    const { pincode, comfirm_delete, message, loading } = this.state;
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
                  this.deletePincode(
                    pincode.pincode == null ? pincode.id : pincode.pincode
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
              to="/pincodes"
            >
              Pincodes
            </Link>{" "}
            <span>{" > " +pincode.pincode}</span>
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
                pathname: `/updatepincode/${pincode.pincode}`,
                state: {pincode },
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
                Pincode <br />
                  <span>{pincode.pincode}</span>
                </div>
                <div className="code">
                  Charges <br />
                  <span>{pincode.charge}</span>
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
