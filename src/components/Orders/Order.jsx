import React, { Component } from 'react';
import _ from 'lodash'
import { price, url, headers } from '../../config'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import firebase from '../../init-firebase';

class Order extends Component {
    state = {
        detail: false,
        input: false,
        id: null
    }

    confirm(id){
        this.props.confirm(id)
    }

    confirmProcess(id){
        this.setState({ id: id, input: true })
    }



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
      // month = a.getMonth();
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
      return time;
    }
    render() {
        const { detail, input } = this.state
        const { order, status } = this.props
        const products =order.products;
        const productsquantities =order.productQuantities;
        return <div className="order">
            {input && <div className="confirm-process">
                <div>
                </div>
              </div>}
            {detail ? <div onClick={() => this.setState({
                    detail: false,
                  })}>
                {status === "waiting" && <div onClick={() => this.confirm(order.id)} className="confirm">
                    Confirm
                  </div>}
                {status === "process" && <div onClick={() => this.confirm(order.id)} className="confirm">
                    Ship
                  </div>}
                  {status === "shipped" && <div onClick={() => this.confirm(order.id)} className="confirm">
                    Delivered
                  </div>}
                <span>Detail Order</span>
                <div className="shipping">
                  <div className="detail">
                  <div>
                      Order Number
                      <span>{order.orderNumber}</span>
                    </div>
                    <div> Date and time
                    <span>
                      {this.timeConverter(order.timestamp.seconds)}
                    </span></div>
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

                <div className="product-shipping">
                  <span>Products</span>
                  <div classname="product">
                    </div>
                </div>
              </div> : <div onClick={() => this.setState({
                    detail: true,
                  })} className="hide">
                <span>Order No: {order.orderNumber}</span>
                <span>Date:{this.timeConverter(order.timestamp.seconds)}</span>
                <span>Name: {order.name}</span>
                <span>Mobile: {order.phone}</span>
                <span>Total : {order.total}</span>
              </div>}
          </div>;
    }
}

const mapStateToProps = (state) => {
    return({
        user : state.userReducer
    })
}

export default connect(mapStateToProps)(Order);