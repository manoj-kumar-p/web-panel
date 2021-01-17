import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Product from "./components/Product";
import Categories from "./components/Categories";
import Coupons from "./components/Coupons";
import Brands from "./components/Brands";
import AddProduct from "./components/Product/AddProduct";
import AddCategory from "./components/Category/AddCategory";
import UpdateCategory from "./components/Category/Up";
import AddBrand from "./components/Brand/AddBrand";
import UpdateBrand from "./components/Brand/Up";
import Customers from "./components/Customers";
import Feedbacks from "./components/Feedbacks";
import Admin from "./components/Admin";
import Up from "./components/Product/Up";
import AddCoupon from "./components/Coupon/AddCoupon";
import UpdateCoupon from "./components/Coupon/Up";
import Coupon from "./components/Coupon";
import Brand from "./components/Brand/index";
import Category from "./components/Category";
import Upd from "./components/Product/Upd";
import Pincodes from "./components/Pincodes";
import Pincode from "./components/Pincode";
import AddPincode from "./components/Pincode/AddPincode";
import UpdatePincode from "./components/Pincode/Up";

class App extends Component {
  componentDidMount() {
    const element = document.getElementById("startingLoader");
    window.onload = () => {
      if (element) {
        element.remove();
      }
    };
  }

  render() {
    const { user } = this.props;
    const localUser = localStorage.getItem("user");
    return (
      <BrowserRouter>
        {user.login || localUser !== null ? (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            {/* these were the ones needed */}
            <Route path="/orders" component={Orders} />
            <Route path="/category/:id" component={Category} />
            <Route path="/coupon/:id" component={Coupon} />
            <Route path="/brand/:id" component={Brand} />
            <Route path="/pincode/:id" component={Pincode} />
            {/* until here */}
            <Route path="/products" component={Products} />
            <Route path="/customers" component={Customers} />
            <Route path="/feedbacks" component={Feedbacks} />
            <Route path="/categories" component={Categories} />
            <Route path="/coupons" component={Coupons} />
            <Route path="/brands" component={Brands} />
            <Route path="/pincodes" component={Pincodes} />
            <Route path="/addproduct" component={AddProduct} />
            <Route path="/addcategory" component={AddCategory} />
            <Route path="/addbrand" component={AddBrand} />
            <Route path="/addcoupon" component={AddCoupon} />
            <Route path="/addpincode" component={AddPincode} />
            <Route path="/product/:id" component={Product} />
            <Route path="/admin" component={Admin} />
            <Route path="/updateproduct/:id" component={Upd} />
            <Route path="/updatecategory/:id" component={UpdateCategory} />
            <Route path="/updatebrand/:id" component={UpdateBrand} />
            <Route path="/updatecoupon/:code" component={UpdateCoupon} />
            <Route path="/updatepincode/:pincode" component={UpdatePincode} />
            <Route path="/*" component={Home} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/*" component={Home} />
          </Switch>
        )}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};

export default connect(mapStateToProps)(App);
