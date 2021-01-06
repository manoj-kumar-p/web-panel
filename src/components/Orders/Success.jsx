import React, { Component } from 'react';
import axios from 'axios'
import { url, headers, price } from '../../config'
import { connect } from 'react-redux'
import _ from 'lodash'
import './new.scss'
import Order from './Order'
import firebase from "../../init-firebase";

class Success extends Component {
    state = {
        orders: [],
        loading: true,
    }

    componentDidMount(){
        this.fetchOrdersUnconfirmed()
    }

    async fetchOrdersUnconfirmed(){
        let orders = localStorage.getItem("shippingsuccess");
        if (orders) {
          this.setState({ orders: JSON.parse(orders), loading: false });
        }
        var ordersArray = [];
        const updateOrders = (orders) => this.setState({
            orders,
            loading: false,
          });
        const ordersRef = firebase.database().ref("/orders");

        // ordersRef.on("value", function(snapshot) {
        //   if (snapshot.exists) {
        //     console.log("snap :", typeof snapshot.val());
        //     snapshot.forEach((order) => {
        //       console.log(order.val());
        //       if (order.val().status == "success") ordersArray.push(order.val());
        //     });
        //     updateOrders(ordersArray);
        //     localStorage.setItem("shippingsuccess", JSON.stringify(ordersArray));
        //   }
        // });
        await firebase.firestore().collection('orders').where("status","==","delivered").get().then(function(snapshot){
        snapshot.forEach(doc=>{
         ordersArray.push(doc.data());
        })
            updateOrders(ordersArray);
            localStorage.setItem("shippingsuccess", JSON.stringify(ordersArray));
        })
        console.log(this.state.orders);

    }

    render() {
        const { orders, loading } = this.state
        return (
            <div className="new-order">

                { loading ? <div className="load"><div></div><div></div><div></div></div> :
                    <div> { orders.length < 1 && <div>Empty</div> } {
                    orders.length > 0 && orders.map(order => 
                        <Order key={order.order_id} status="success" order={order} />
                        )
                    }</div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return({
        user : state.userReducer
    })
}

export default connect(mapStateToProps)(Success);