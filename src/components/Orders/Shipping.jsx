import React, { Component } from "react";
import axios from "axios";
import { url, headers } from "../../config";
import _ from "lodash";
import { connect } from "react-redux";
import "./new.scss";
import firebase from '../../init-firebase';

import Order from "./Order";

class Shipped extends Component {
  state = {
    orders: [],
    loading: true,
    message: "",
  };

  componentDidMount() {
    this.fetchOrdersUnconfirmed();
  }

  async fetchOrdersUnconfirmed() {
    let orders = localStorage.getItem("processorders");
    if (orders) {
      this.setState({ orders: JSON.parse(orders), loading: false });
    }
    var ordersArray =[];
    const updateOrders=(orders)=>this.setState({orders,loading:false})
    // const ordersRef = firebase.database().ref('/orders');
    // ordersRef.on('value',function(snapshot){
    //   if(snapshot.exists){
    //     console.log("snap :",typeof snapshot.val());
    //     snapshot.forEach(order=>{
    //       console.log(order.val())
    //       if(order.val().status=="unconfirmed")
    //         ordersArray.push(order.val())
    //     });
    //     updateOrders(ordersArray)
    //     localStorage.setItem("neworders", JSON.stringify(ordersArray));
    //   }
    // });
    await firebase.firestore().collection('orders').where("status","==","shipped").get()
     .then(function(snapshot){
      console.log("snap",snapshot);
      snapshot.forEach(doc=>{
        ordersArray.push(doc.data())
      })
      updateOrders(ordersArray)
    });
    console.log(this.state.orders);
    //  this.setState({
    //    orders: [
    //      {
    //        shipping_info: {
    //          received_name: "Manoj Kumar",
    //          phone: 3334443339,
    //          province_name: "TN",
    //          city_name: "Tirunelveli",
    //        },
    //        order_id: 12,
    //        status: "unconfirmed",
    //        invoice: "invoice",
    //        due_date: "29/12/12",
    //        amount: 298,
    //        shipping_cost: 298,
    //        total_payment: 928,
    //        order_detail: [
    //        {
    //         product_id: 1,
    //         order_detail_id: 2,
    //         name:"chapati", 
    //         quantity: 2,
    //         price: 200,
    //        },
    //         {
    //         product_id: 2,
    //         order_detail_id: 2,
    //         name:"Poori",
    //         quantity: 2,
    //         price: 210,
    //        },
    //       ],
    //      },
    //    ],
    //    loading: false,
    //  });
  }

  confirm =async (id) => {
    this.setState({ loading: true });

    const updateSuccess=(e)=>{this.setState({message: "Success confirm order", loading: false});this.fetchOrdersUnconfirmed();};
    const failedSuccess=(e)=>this.setState({message: "Failed to confirm order", loading: false})
   
    await firebase.firestore().collection('orders').doc(id)
      .update({ status: "delivered" })
      .then(updateSuccess).catch(failedSuccess);
    this.setState({loading:false})
    
  };

  render() {
    const { orders, loading, message } = this.state;
    return (
      <div className="new-order">
        <span style={{ color: "red" }}>{message}</span>
        {loading ? (
          <div className="load">
            <div />
            <div />
            <div />
          </div>
        ) : (
          <div>
            {" "}
            {orders.length < 1 && <div>Empty</div>}{" "}
            {orders.length > 0 &&
              orders.map((order) => (
                <Order
                  key={order.order_id}
                  status="shipped"
                  order={order}
                  confirm={this.confirm}
                />
              ))}
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

export default connect(mapStateToProps)(Shipped);
