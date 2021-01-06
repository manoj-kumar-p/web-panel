import React, { Component } from 'react';
import axios from 'axios'
import { url, headers } from '../../config'
import { connect } from 'react-redux'
import _ from 'lodash'
import './new.scss'
import Order from './Order'
import firebase from '../../init-firebase'

class Cancelled extends Component {
    state = {
        orders: [],
        loading: true,
        detail: false
    }

    componentDidMount(){
        this.fetchOrdersUnconfirmed()
    }

    async fetchOrdersUnconfirmed(){
        let orders = localStorage.getItem('returnedorders') 
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
        //       if (order.val().status == "returned") ordersArray.push(order.val());
        //     });
        //     updateOrders(ordersArray);
        //     localStorage.setItem("returnedorders", JSON.stringify(ordersArray));
        //   }
        // });
         await firebase.firestore().collection('OrderedProducts').where("status","==","returned").get().then(function(snapshot){
        snapshot.forEach(doc=>{
         ordersArray.push(doc.data());
        })
            updateOrders(ordersArray);
            localStorage.setItem("returnedorders", JSON.stringify(ordersArray));
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
                        <Order key={order.order_id} status="returned" order={order} />
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

export default connect(mapStateToProps)(Cancelled);