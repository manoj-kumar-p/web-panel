import React, { Component } from "react";
import "./feedbacks.scss";
import axios from "axios";
import { url, headers } from "../../config";
import { connect } from "react-redux";

import Header from "../Header";
import Navbar from "../Navbar";
import firebase from "../../init-firebase";

class index extends Component {
  state = {
    feedbacks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    loading: true,
  };
  async getCustomerOfId(uid) {
    var user = await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get();
    return user.data();
  }
  async fetchFeedBacks() {
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks"));
    if (feedbacks) {
      this.setState({ feedbacks, loading: false });
    }

    var feedbacksArray = [];
    const getCustomerOfId = this.getCustomerOfId;
    const setState = (e) => this.setState(e);
    await firebase
      .firestore()
      .collection("feedbacks")
      .get()
      .then(function(snapshot) {
        if (snapshot) {
          snapshot.forEach(async (doc) => {
            var data = doc.data();
            var user = await getCustomerOfId(data.uid);
            Object.assign(data, {
              name: user.name,
              number: user.number,
              email: user.email,
            });
            feedbacksArray.push(data);
            if (feedbacksArray.length == snapshot.size) {
              console.log("feedbacks: ", feedbacksArray);
              localStorage.setItem("feedbacks", JSON.stringify(feedbacksArray));
              setState({ feedbacks: feedbacksArray, loading: false });
            }
          });
        }
      });
  }
  async componentDidMount() {
    this.fetchFeedBacks();
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
    const { feedbacks, customers, loading } = this.state;
    return (
      <div className="customers">
        <Header />
        <Navbar />
        <div className="wrapper">
          <span>Feedbacks</span>
          {
            <div className="customerdetails">
              <div className="photo">
                <span>Name</span>
              </div>
              <span>Mobile Number</span>
              <span>Date</span>
              <span>Feedback</span>
              <span>Level of satisfaction</span>
            </div>
          }

          {loading
            ? feedbacks.map((val, i) => (
                <div className="loading-customers" key={i} />
              ))
            : feedbacks.map((feedback) => {
                return (
                  <div key={feedback.uid} className="customer">
                    <div className="photo">
                      <span>{feedback.name}</span>
                    </div>
                    <span>{feedback.number}</span>
                    <span>
                      {this.timeConverter(feedback.timestamp.seconds)}
                    </span>
                    <span>{feedback.feedback}</span>
                    <span>{feedback.satisfactionLevel}</span>
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
