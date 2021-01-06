import React, { Component } from "react";
import "./customers.scss";
import axios from "axios";
import { url, headers } from "../../config";
import { connect } from "react-redux";

import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    customers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    loading: true,
  };

  async componentDidMount() {
    let customers = JSON.parse(localStorage.getItem("customers"));
    if (customers) {
      this.setState({ customers, loading: false });
    }

    var customersArray = [];

    await firebase
      .firestore()
      .collection("users")
      .get()
      .then(function(snapshot) {
        if (snapshot) {
          snapshot.forEach((doc) => {
            customersArray.push(doc.data());
          });
        }
      });
    console.log("custs: ", customersArray);
    localStorage.setItem("customers", JSON.stringify(customersArray));
    this.setState({ customers: customersArray, loading: false });
  }
  async sortBy(param, order = "asc") {
    this.setState({ loading: true });
    var customersArray = [];

    await firebase
      .firestore()
      .collection("users")
      .orderBy(param, order)
      .get()
      .then(function(snapshot) {
        if (snapshot) {
          snapshot.forEach((doc) => {
            customersArray.push(doc.data());
          });
        }
      });
    console.log("custs: ", customersArray);
    this.setState({ customers: customersArray, loading: false });
  }

  render() {
    const { customers, loading } = this.state;
    return (
      <div className="customers">
        <Header />
        <Navbar />
        <div className="wrapper">
          <span>Customers</span>
          {
            <div className="customerdetails1">
              <div className="photo">
                <span>Name</span>
                <button
                  style={{ marginLeft: "1em", color: "blue", border: "none" }}
                  onClick={() => this.sortBy("name")}
                >
                  Sort
                </button>
              </div>
              <span>Mobile Number</span>
              <span>Email</span>
              <span>
                Ordercount
                <button
                  style={{
                    marginLeft: "1em",
                    position: "absolute",
                    color: "blue",
                    border: "none",
                  }}
                  onClick={() => this.sortBy("orderCount", "desc")}
                >
                  Sort
                </button>
              </span>
            </div>
          }

          {loading
            ? customers.map((val, i) => (
                <div className="loading-customers" key={i} />
              ))
            : customers.map((customer) => {
                return (
                  <div key={customer.uid} className="customer1">
                    <div className="photo">
                      <span>{customer.name}</span>
                    </div>
                    <span>{customer.number}</span>
                    <span>{customer.email}</span>
                    <span>{customer.orderCount}</span>
                  </div>
                );
              })}
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
