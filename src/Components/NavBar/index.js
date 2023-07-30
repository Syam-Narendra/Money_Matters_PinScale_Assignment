import {Component} from "react"
import Cookies from "js-cookie"
import "./index.css"


const NavItem = (props) =>{
    const {data,activeTabClassName} = props;
    const {name,icon_pack,function_name} = data
    const activeCLass= activeTabClassName ? "active-tab":""
    return(
        <button onClick={function_name} className={`nav-item-button ${activeCLass}`}>
            <i class={icon_pack}></i>
            <h1>{name}</h1>
        </button>
    )

}


class NavBar extends Component{

    state = {userData:[]}

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
        this.setState({userData:data.users[0]})
    }
    
    componentDidMount(){
        const userId = Cookies.get("user_id")
        this.fetchUserData(userId)
    }

    onClickLogout=()=>{
        Cookies.remove("user_id")
        window.location.reload()
    }

    render(){
        const {setDashBoard,setProfile,setTranscation,activeTab} = this.props
        const {userData} = this.state
        const {name,email}= userData
        const navItemsData = [
            {
            id:"dashboard",
            name:"Dashboard",
            icon_pack:"fa-solid fa-house",
            function_name:setDashBoard},
            {
                id:"transcation",
                name:"Transcations",
                icon_pack:"fa-solid fa-money-bill-transfer",
                function_name:setTranscation
            },
            {
                id:"profile",
                name:"Profile",
                icon_pack:"fa-solid fa-user",
                function_name:setProfile
            }
        
        ]
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
                            <NavItem key={item.id} data={item} activeTabClassName={activeTab===item.id}/>
                        ))
                    }
                </div>
                </div>
                <div className='bottom-profile-section'>
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
                </div>
            </div>
        )
    }
}

export default NavBar