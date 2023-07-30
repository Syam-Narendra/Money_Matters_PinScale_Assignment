import '@fortawesome/fontawesome-free/css/all.min.css';
import "./index.css"
import {Component} from "react";
import NavBar from "../NavBar/index"

const tabNames = {dashBoard: "dashboard",transcation:"transcation",profile:"profile",}

class UserHome extends Component {
    state ={activeTab: tabNames.dashBoard}

    setDashBoard = () => {
        this.setState({activeTab: tabNames.dashBoard})
    }

    setTranscation = () => {
            this.setState({activeTab: tabNames.transcation})
    }

    setProfile = () => {
        this.setState({activeTab: tabNames.profile})
    }

    render(){
        const {activeTab} = this.state
        return(
        <div className="user-home-main-container">
            <NavBar activeTab={activeTab} setDashBoard={this.setDashBoard} setProfile={this.setProfile} setTranscation={this.setTranscation}/>
            <div className="accounts-dashboard-container">
                <h1>{activeTab}</h1>
            </div>
        </div>   
        )
    }
}

export default UserHome