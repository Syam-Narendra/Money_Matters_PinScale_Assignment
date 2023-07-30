import Cookies from "js-cookie";
import {Redirect,Route} from "react-router-dom"

const CheckValidation =(props)=>{
    if(Cookies.get("user_id")===undefined){
        return <Redirect to="/login"/>;
    }
    return <Route {...props}/>
}

export default CheckValidation;