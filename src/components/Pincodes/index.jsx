import React, { Component } from "react";
import "./pincodes.scss";
import { connect } from "react-redux";
import {pincodeAction } from "../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

import Pincode from "./Pincode";
import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    show: "card",
    loading: true,
    pincodes: [],
    code: 0,
    top: "100px",
  };

  componentDidMount() {
    this.fetchPincodes();

    window.addEventListener("scroll", () => {
      let scroll = window.scrollY;
      if (scroll > 0) {
        this.setState({ top: "65px" });
      } else {
        this.setState({ top: "100px" });
      }
    });
  }

  fetchPincodes = async () => {
    var pincodesArray = [];
    var t_pincodes = localStorage.getItem("pincodes");
    if (t_pincodes) {
      this.setState({ pincodes: JSON.parse(t_pincodes), loading: false });
    }

    const pincodesRef = firebase.firestore().collection("pincodes");
    await pincodesRef.get().then(function(snapshot) {
      snapshot.forEach((doc) => pincodesArray.push(doc.data()));
    });
    console.log("pincode: ", pincodesArray);

    this.setState({ pincodes: pincodesArray, loading: false });
    localStorage.setItem("pincodes", JSON.stringify(pincodesArray));
    this.props.pincodeAction(pincodesArray);
  };

  render() {
    const { top, loading, show, pincodes, code } = this.state;
    return (
      <div className="products">
        <Header />
        <Navbar />

        <div className="wrapper">
          <Link to="/addpincode">
            <div style={{ top: top, transition: "0.5s" }} className="new">
              <i className="demo-icon icon-plus">&#xe808;</i>
            </div>
          </Link>

          <span>Pincodes</span>
          {// loading product
          loading ? (
            <div className={show}>
              {pincodes.map((num) => (
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
              pincodes.length === 0 ? (
                <span style={{ color: "red" }}>Empty</span>
              ) : (
                pincodes.map((pincode) => (
                  <Pincode key={pincodes.pincode} pincode={pincode} />
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
    pincodes: state.pincodesReducer,
    user: state.userReducer,
  };
};

export default connect(
  mapStateToProps,
  { pincodeAction }
)(index);
