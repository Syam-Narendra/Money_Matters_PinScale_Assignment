import { Component } from "react"
import Cookies from "js-cookie"
import "./index.css"
import { TailSpin } from "react-loader-spinner"

const ProfileItem = (props) => {
    const {heading,value}=props
    const caps = (heading.charAt(0).toUpperCase() + heading.slice(1)).replace(/_/g, ' ');
    return <div className="profile-item-detail">
            <h1 className="profile-item-heading">{caps}</h1>
            <p className="profile-item-value">{value}</p>
        </div>
}

const pageStatusData = {
    loading:"loading",
    success:"success",
    error:"error",
}

class Profile extends Component {
    state={userData:{},pageStatus:pageStatusData.loading}

    getProfileData=async id =>{
        try{
        const apiUrl = 'https://bursting-gelding-24.hasura.app/api/rest/profile';
        const headers = {
        'content-type': 'application/json',
        "x-hasura-role":"user",
        "x-hasura-user-id":id,
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        };

        const requestOptions = {
        method: 'GET',
        headers: headers,
        };
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        const userData = data.users[0]
        for (const key in userData){
            console.log(key, userData[key])
        }
        this.setState({userData,pageStatus:pageStatusData.success})
    }catch(e){
        this.setState({pageStatus:pageStatusData.error})
    }
    }

    componentDidMount(){
        const userId = Cookies.get("user_id")
        this.getProfileData(userId);
    }

    renderSwitch(){
        const {pageStatus} = this.state
                switch(pageStatus){
                    case pageStatusData.loading:
                        return <div className="error-loading"><TailSpin color="#F89A23" height={50}/></div>
                    case pageStatusData.success:
                        return this.renderDetails()
                    default:
                        return <div className="error-loading"><h1>SomeThing Went Wrong</h1></div>
                }
    }

    renderDetails=()=>{
        const {userData} = this.state
        return (
            <div className="profile-body">
                {Object.keys(userData).map((key) => (
                    <ProfileItem heading={key} value={userData[key]}/>
                ))}
            </div>
        )
    }

    render() {
        return (
                    <div>
                        <div className="profile-header">
                        <h1 className="heading">Profile</h1>
                        </div>
                        {this.renderSwitch()}
                    </div>
                )
    }
}
export default Profile