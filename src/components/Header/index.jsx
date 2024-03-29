import React, { Component } from 'react';
import './header.scss'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import  { logoutAction } from '../../actions'

class index extends Component {
    state={
        dropdown: true,
        data: {
            user: '',
            photo: '',
            name: '',
            email: ''
        }
    }


    componentDidMount(){

        let data = this.props.user.data
        if(data){
            this.setState({ data })
        }
    }

    dropDown = () => {
        this.setState({ dropdown: !this.state.dropdown })
    }

    render() {
        const { dropdown, data } = this.state
        return (
            <div className="header">
                <div className="title">
                    <Link style={{ textDecoration: 'none', color: 'white' }} to="/dashboard"><span>Pad Angels</span></Link>
                </div>
                <div className="admin">
                <span onClick={this.dropDown}>{data.name} {dropdown ?  <i className="demo-icon icon-down-circle">&#xe810;</i> : <i className="demo-icon icon-up-circle">&#xe802;</i>  }</span>

                    <div className={`dropdown ${ dropdown ? `hide` : ``}`}>
                         <span onClick={()=>this.props.logoutAction() } className="logout"><i className="demo-icon icon-power">&#xe80e;</i> Logout</span>                        
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer
    }
}

export default  connect(mapStateToProps,{ logoutAction })(index);       