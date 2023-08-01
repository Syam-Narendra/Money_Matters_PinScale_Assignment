import {Component} from "react"
import Cookies from "js-cookie"
import { TailSpin } from "react-loader-spinner"
import Modal from 'react-modal';
import "./index.css"


const NavItem = (props) =>{
    const {data,activeTabClassName,changeTab} = props;
    const {id,name,icon_pack} = data
    const activeCLass= activeTabClassName ? "active-tab":""
    const onClickTab=()=>{
        changeTab(id)
    }
    return(
        <button onClick={onClickTab} className={`nav-item-button ${activeCLass}`}>
            <i class={icon_pack}></i>
            <h1>{name}</h1>
        </button>
    )
}

const navItemsData = [
    {
    id:"dashboard",
    name:"Dashboard",
    icon_pack:"fa-solid fa-house",
    },
    {
        id:"transcation",
        name:"Transcations",
        icon_pack:"fa-solid fa-money-bill-transfer",
    },
    {
        id:"profile",
        name:"Profile",
        icon_pack:"fa-solid fa-user",
    }

]


class NavBar extends Component{

    state = {userData:[],isLoading:true,showPopUp:false};

    fetchUserData= async(userId)=>{
        const apiUrl = 'https://bursting-gelding-24.hasura.app/api/rest/profile';
        const headers = {
        'content-type': 'application/json',
        'x-hasura-user-id':userId,
        'x-hasura-role':"user",
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        };
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(apiUrl, requestOptions)
        const data = await response.json()
        this.setState({userData:data.users[0],isLoading:false});
    }
    
    componentDidMount(){
        const userId = Cookies.get("user_id")
        this.fetchUserData(userId)
    }

    onClickLogout=()=>{
        this.setState({showPopUp:true})
    }

    onClickConfirmLogout=()=>{
        Cookies.remove("user_id")
        window.location.reload()
    }

    closePopUp=()=>{
        this.setState({showPopUp:false})
    }

    navBarProfileSection = ()=> {
        const {userData,showPopUp} = this.state
        const {name,email}= userData
        return(
        <>
            <Modal className="logout-popup" isOpen={showPopUp} onRequestClose={this.closePopUp}>
                <div className="logut-buttons-sections">
                    <i class="confirm-logout-icon fa-solid fa-right-from-bracket"></i>
                    <h2>Are You Sure To Want To Logout?</h2>
                <div className="pop-up-buttons">
                    <button className="pop-up-logout" onClick={this.onClickConfirmLogout}>Yes, Logout</button>
                    <button className="pop-up-cancel-button" onClick={this.closePopUp}>Cancel</button>
                </div>
                </div>
            </Modal>
            <img src="https://i.ibb.co/wBzWWN3/avatar.jpg" className='avatar' alt="avatar"/>
            <div className='name-email'>
                <h1 className='user-name'>{name}</h1>
                <div className='bottom-email-logout'>
                    <p>{email}</p>
                    <button onClick={this.onClickLogout} className='logout-button'>
                    <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </>
        )
    }

    renderLoader=()=> <TailSpin height={40} color="#F89A23"/>

    render(){
        const {changeTab,activeTabId} = this.props
        const {isLoading} = this.state
        return(
            <div className="title-profile-container">
                <div>
                <div className="title">
                <img className="logo" src="https://i.ibb.co/q1XpcH4/website-Icon.png" alt="logo"/>
                <h1 className="money-text-class">Money</h1> 
                <h1 className="matter-text-class">Matters</h1>
                </div>
                <div className="heading-section">
                    {
                        navItemsData.map(item=>(
                            <NavItem key={item.id} data={item} changeTab={changeTab} activeTabClassName={activeTabId===item.id}/>
                        ))
                    }
                </div>
                </div>
                <div className='bottom-profile-section'>
                    {isLoading ? this.renderLoader() : this.navBarProfileSection()}
                </div>
            </div>
        )
    }
}

export default NavBar