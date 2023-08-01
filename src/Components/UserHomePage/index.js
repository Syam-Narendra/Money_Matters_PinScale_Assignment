import '@fortawesome/fontawesome-free/css/all.min.css';
import "./index.css"
import {Component} from "react";
import NavBar from "../NavBar/index"
import {DashBoard} from "../DashBoardPage/index"
import Profile from "../ProfilePage/index"
import Transcation from "../TranscationPage/index"

const tabNames = {dashBoard: "dashboard",transcation:"transcation",profile:"profile",}

class UserHome extends Component {
    state ={activeTabId: tabNames.dashBoard}

    changeTab= tabId => {
        this.setState({activeTabId: tabId})
    }

    renderTab=()=>{
        const {activeTabId} = this.state
        switch(activeTabId){
            case tabNames.dashBoard:
                return <DashBoard/>
            case tabNames.transcation:
                return <Transcation/>
            case tabNames.profile:
                return <Profile/>
            default:
                return <h1>SomeThing Went Wrong</h1>
        }
    }

    render(){
        const {activeTabId} = this.state
        return(
        <div className="user-home-main-container">
            <NavBar activeTabId={activeTabId} changeTab={this.changeTab}/>
            <div className="accounts-dashboard-container">
                {this.renderTab()}
            </div>
        </div>   
        )
    }
}

export default UserHome