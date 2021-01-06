import React, { Component } from 'react';
import './feedbacks.scss'
import axios from 'axios'
import { url, headers } from '../../config'
import { connect } from 'react-redux'

import Header from '../Header'
import Navbar from '../Navbar'
import firebase from '../../init-firebase'

class index extends Component {
    state = {
        feedbacks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        loading: true,
      };
    
      async componentDidMount() {
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks"));
        if (feedbacks) {
          this.setState({ feedbacks, loading: false });
        }
        
    
        var feedbacksArray = [];
    
        await firebase
          .firestore()
          .collection("feedbacks")
          .get()
          .then(function(snapshot) {
            if (snapshot) {
              snapshot.forEach((doc) => {
                feedbacksArray.push(doc.data());
              });
            }
          });
        console.log("feedbacks: ", feedbacksArray);
        this.setState({ feedbacks: feedbacksArray, loading: false });
      }
     
    render() {
        const {feedbacks, customers, loading } = this.state
        return (
            <div className="customers">
                <Header />
                <Navbar />
                <div className="wrapper">
                    <span>Feedbacks</span>{
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

                    {
                       loading ? feedbacks.map((val, i)=> <div className="loading-customers" key={i}></div> ) :
                       feedbacks.map(feedback=>{
                            return(
                                <div key={feedback.uid} className="customer">
                                    <div className="photo">
                                    <span></span>
                                    </div>
                                    <span></span>
                                    <span></span>
                                    <span>{feedback.feedback}</span>
                                    <span>{feedback.satisfactionLevel}</span>
                                </div>
                            )
                        })     
                    }

                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return({
        user: state.userReducer
    })
}

export default connect(mapStateToProps)(index);