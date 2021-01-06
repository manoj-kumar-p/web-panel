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


    render() {
        const { detail, input } = this.state
        const { order, status } = this.props
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
                  
                </div>
              </div> : <div onClick={() => this.setState({
                    detail: true,
                  })} className="hide">
                <span>Order No: {order.orderNumber}</span>
                <span>Name: {order.name}</span>
                <span>Mobile: {order.phone}</span>
                {/* <span>Total : {Object.keys(order.products).length} product</span> */}
                <span>Total : {order.total}</span>
                {/* <span>Date : {order.timestamp}</span> */}
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