import {Component} from "react"
import { Redirect } from "react-router-dom"
import Cookies from "js-cookie"
import {TailSpin as Loader} from "react-loader-spinner"
import "./index.css"

const errorText ="* E-Mail or Password Are Invalid"
class  Login extends Component{
    state = {email: "", password:"",isLoading: false,showError:false,}

    handleSubmit = async(event) => {
        event.preventDefault();
        this.setState({isLoading: true,showError:false});
        const {email, password} = this.state;
        try{
            const url = `https://bursting-gelding-24.hasura.app/api/rest/get-user-id?email=${email}&password=${password}`;
            const options = {
                method: 'POST',
                headers:  {
                    'content-type': 'application/json',
                    'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
                }
            };

            const response = await fetch(url, options)
            const data = await response.json();
            if (data.get_user_id.length===1){
                const id = data.get_user_id[0].id
                Cookies.set("user_id", id, { expires: 365 })
                window.location.reload()
            }
            else{
                this.setState({isLoading: false,showError:true})
            }
        }catch(error){
            this.setState({isLoading: false,showError:true})
        }
        
    }
    render(){
        const {isLoading,showError} = this.state;
        if (Cookies.get("user_id")!==undefined){
            return <Redirect to={"/"}/>
        }
        return (
            <div className="login-page">
                <div className="login-page-container">
                    <form onSubmit={this.handleSubmit} className="form-group">
                        <h1>Login</h1>
                            <label>Email</label>
                            <input type="email" className="form-input" placeholder="Email" onChange={(e) => this.setState({email: e.target.value})}/>
                            <label>Password</label>
                            <input type="password" className="form-input" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})}/>
                            <p className="error-text">{showError && errorText}</p>
                            <button type="submit" className="login-button">
                                {isLoading ? <Loader color="white" height={20}/>:"Login"}
                            </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;