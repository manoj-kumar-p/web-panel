import React, { Component } from "react";
import _ from "lodash";
import { price, url, headers } from "../../config";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import firebase from "../../init-firebase";

class Order extends Component {
  state = {
    detail: false,
    input: false,
    id: null,
    orders: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    orderedProducts: [],
  };

  confirm(id) {
    this.props.confirm(id);
  }

  confirmProcess(id) {
    this.setState({ id: id, input: true });
  }

  async getProductOfId(id) {
    var product = await firebase
      .firestore()
      .collection("products")
      .doc(id)
      .get();
    return product.data();
  }
  // async fetchProductsordered() {
  //   let prodcutsordered = JSON.parse(localStorage.getItem("prodcutsordered"));
  //   if (prodcutsordered) {
  //     this.setState({ prodcutsordered, loading: false });
  //   }
  async getOrderedProducts() {
    console.log("order is");
    console.log(this.props.order);
    var order = this.props.order;
    var orderedProducts = [];

    for (let i = 0; i < order.products.length; i++) {
      // previous ordered products' ids are deleted in the firestore
      let p = await this.getProductOfId(order.products[i]);
      // let p = await this.getProductOfId("ixsG3wq8MPUxz8cKOZR0");
      if (!p) return;

      if (order.sizes.hasOwnProperty(order.products[i])) {
        orderedProducts.push({
          name: p.name,
          quantity: order.productQuantities[i],
          size: order.sizes[order.products[i]],
        });
      } else {
        orderedProducts.push({
          name: p.name,
          quantity: order.productQuantities[i],
          size: null,
        });
      }
    }

    await this.setState({ orderedProducts });
    console.log(this.state.orderedProducts);
  }

  // var prodcutsorderedArray = [];
  //   const getProductOfId = this.getProductOfId;
  //   const setState = (e) => this.setState(e);
  //   await firebase
  //     .firestore()
  //     .collection("orders")
  //     .get()
  //     .then(function(snapshot) {
  //       if (snapshot) {
  //         snapshot.forEach(async (doc) => {
  //           var data = doc.data();
  //           var product = await getProductOfId(data.products); //TODO
  //           Object.assign(data, {
  //             name: product.name,
  //           });
  //           prodcutsorderedArray.push(data);
  //           if (prodcutsorderedArray.length == snapshot.size) {
  //             console.log("prodcutsordered: ", prodcutsorderedArray);
  //             localStorage.setItem("prodcutsordered", JSON.stringify(prodcutsorderedArray));
  //             setState({ prodcutsordered: prodcutsorderedArray, loading: false });
  //           }
  //         });
  //       }
  //     });
  // }
  // async componentDidMount() {
  //   this.fetchProductsordered();
  // }
  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }
  render() {
    const { detail, input } = this.state;
    const { order, status } = this.props;
    const products = order.products;
    const productsquantities = order.productQuantities;
    const orderedProducts = this.state.orderedProducts;
    return (
      <div className="order">
        {input && (
          <div className="confirm-process">
            <div />
          </div>
        )}
        {detail ? (
          <div
            onClick={() =>
              this.setState({
                // detail: false,
              })
            }
          >
            {status === "waiting" && (
              <div onClick={() => this.confirm(order.id)} className="confirm">
                Confirm
              </div>
            )}
            {status === "process" && (
              <div onClick={() => this.confirm(order.id)} className="confirm">
                Ship
              </div>
            )}
            {status === "shipped" && (
              <div onClick={() => this.confirm(order.id)} className="confirm">
                Delivered
              </div>
            )}
            <span>Detail Order</span>
            <div className="shipping">
              <div className="detail">
                <div>
                  Order Number
                  <span>{order.orderNumber}</span>
                </div>
                <div>
                  {" "}
                  Date and time
                  <span>{this.timeConverter(order.timestamp.seconds)}</span>
                </div>
                <div>
                  Name
                  <span>{order.name}</span>
                </div>
                <div>
                  Phone
                  <span>{order.phone}</span>
                </div>
                <div>
                  House No
                  <span>{order.houseNo}</span>
                </div>
                <div>
                  Road Name
                  <span>{order.roadName}</span>
                </div>
                <div>
                  Town
                  <span>{order.town}</span>
                </div>
                <div>
                  City
                  <span>{order.city}</span>
                </div>
                <div>
                  State
                  <span>{order.state}</span>
                </div>
                <div>
                  Postal Code
                  <span>{order.pincode}</span>
                </div>
              </div>
              <div className="payment">
                <div>
                  Status
                  <span>{order.status}</span>
                </div>
                <div>
                  Total Amount
                  <span>{order.total}</span>
                </div>
                <div>
                  Alternate Mobile:
                  <span>{order.altPhoneNo}</span>
                </div>
              </div>
            </div>

            <div className="product-shipping" style={{ marginBottom: "1em" }}>
              <div style={{ height: "1.5em", textAlign: "left" }}>
                <span>Products</span>
                <button
                  style={{
                    backgroundColor: "#216aaf",
                    marginLeft: "2em",
                    color: "white",
                  }}
                  onClick={async () => {
                    await this.getOrderedProducts();
                    console.log(orderedProducts);
                  }}
                >
                  Show products
                </button>
              </div>
              {orderedProducts.length < 1
                ? ""
                : orderedProducts.map(function(e, idx) {
                    console.log(e);
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          marginLeft: "5em",
                          marginRight: "5em",
                          borderBottomWidth: "1px",
                          borderBottomColor: "#aa1111",
                          borderBottomStyle: "solid",
                          height: "2.8em",
                        }}
                      >
                        <h3>{e.name}</h3>
                        <h3
                          style={{
                            position: "absolute",
                            marginLeft: "15em",
                            color: "black",
                          }}
                        >
                          {e.quantity}
                        </h3>
                        <h3
                          style={{
                            position: "absolute",
                            marginLeft: "25em",
                            color: "black",
                          }}
                        >
                          {e.size}
                        </h3>
                        <br />
                      </div>
                    );
                  })}
              <span>{"  "}</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() =>
              this.setState({
                detail: true,
              })
            }
            className="hide"
          >
            <span>Order No: {order.orderNumber}</span>
            <span>Date:{this.timeConverter(order.timestamp.seconds)}</span>
            <span>Name: {order.name}</span>
            <span>Mobile: {order.phone}</span>
            <span>Total : {order.total}</span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(Order);
