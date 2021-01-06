import React, { Component } from 'react';
import './orders.scss'

import Header from '../Header'
import Navbar from '../Navbar'
import New from './New';
import Shipped from './Shipping'
import Delivered from './Success'
import Process from './Process'
import Cancelled from './Cancelled'

class index extends Component {
    state = {
        tab: "new"
    }
 
    render() {
        const { tab } = this.state
        return (
            <div className="orders">
                <Header />
                <Navbar />
                <div className="wrapper">
                    <span>Orders</span>

                    <div className="tab">
                        <div className={ tab === "new" ? "active" : "" } onClick={()=>this.setState({ tab: "new" })}>
                            <span>New</span>
                        </div>
                        <div  className={ tab === "process" ? "active" : "" } onClick={()=>this.setState({ tab: "process" })}>
                            <span>Process</span>
                        </div>
                        <div  className={ tab === "shipped" ? "active" : "" } onClick={()=>this.setState({ tab: "shipped" })}>
                            <span>Shipped</span>
                        </div>
                        <div  className={ tab === "success" ? "active" : "" } onClick={()=>this.setState({ tab: "delivered" })}>
                            <span>Delivered</span>
                        </div>
                        <div  className={ tab === "returned" ? "active" : "" } onClick={()=>this.setState({ tab: "cancelled" })}>
                            <span>Cancelled</span>
                        </div>
                    </div>

                    <div className="list-orders">
                    {
                        tab === "new" && <New />
                    }
                    {
                        tab === "process" && <Process />
                    }
                    {
                        tab === "shipped" && <Shipped />
                    }
                    {
                        tab === "delivered" && <Delivered />
                    }
                    {
                        tab === "cancelled" && <Cancelled />
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default index;