import {BrowserRouter as Router, Route,Redirect,Switch } from "react-router-dom";
import CheckValidation from "./Components/CheckValidation";
import Login from "./Components/LoginPage/index"
import UserHome from "./Components/UserHomePage/index"
import NotFound from "./Components/NotFoundPage/index"
import './App.css';

function App() {
    return(
    <Router>
    <Switch>
      <Route exact path="/login" component={Login}/>
      <CheckValidation exact path="/" component={UserHome}/>
      <Route exact path="/page-not-found" component={NotFound}/>
      <Redirect to="page-not-found"/>
    </Switch>
    </Router>
    )
}

export default App;
