import { Component } from "react"
import Cookies from "js-cookie"
import "./index.css"
import LastTranscationItem from "../LastTranscationItem/index"
import { TailSpin } from "react-loader-spinner"

const pageStatusData ={
    loading:"loading",
    success:"success",
    error:"error",
    noData:"noData",
}

class DashBoard extends Component {
    state = {creditAmount: 0,debitAmount: 0,lastTranscations:[],pageStatus:pageStatusData.loading}

    getCreditDebitAmount= async id=>{
        try{
        const apiUrl = 'https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals';
        const headers = {
        'content-type': 'application/json',
        'x-hasura-user-id':id,
        'x-hasura-role':"user",
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        };

        const requestOptions = {
        method: 'GET',
        headers: headers,
        };
        const response = await fetch(apiUrl, requestOptions)
        const data = await response.json()
        const dataObject = data.totals_credit_debit_transactions
        dataObject.forEach(item=>{
            if(item["type"]==="credit"){
                this.setState({creditAmount:item["sum"]})
            }
            if(item["type"]==="debit"){
                this.setState({debitAmount:item["sum"]})
            }
        }
        )
    }catch(e){
        this.setState({pageStatus:pageStatusData.error})
    }
    }

    getLastTransaction= async id=>{
        try{
        const apiUrl = 'https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=4&offset=0';
        const headers = {
        'content-type': 'application/json',
        'x-hasura-user-id':id,
        'x-hasura-role':"user",
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        };

        const requestOptions = {
        method: 'GET',
        headers: headers,
        };

        const response = await fetch(apiUrl, requestOptions)
        const data = await response.json()
        const dataObject = data.transactions
        if(dataObject.length===0){
                    this.setState({pageStatus:pageStatusData.noData})
        }
        else{
            this.setState({lastTranscations:dataObject,pageStatus:pageStatusData.success})
        }
        console.log(data.transactions)
    }catch(e){
        this.setState({pageStatus:pageStatusData.error})
    }
}

    componentDidMount(){
        const id = Cookies.get("user_id")
        this.getCreditDebitAmount(id)
        this.getLastTransaction(id)
    }

    renderCreditDebitAmounts=()=>{
        const {creditAmount,debitAmount,}= this.state
        return(
            <>
            <div className="accounts-header">
                <h1 className="accounts-heading">Accounts</h1>
                <button className="add-transcation-button">+ Add Transcation</button>
            </div>
            <div className="credit-debit-container">
                <div className="details-card">
                    <div>
                    <h1 className="credit-amount">${creditAmount}</h1>
                    <p className="credit-heading">Credit</p>
                    </div>
                    <img src="https://i.ibb.co/8cbHpsr/Group.png" alt="credit-logo" />
                </div>
                <div className="details-card">
                    <div>
                    <h1 className="debit-amount">${debitAmount}</h1>
                    <p className="credit-heading">Debit</p>
                    </div>
                    <img src="https://i.ibb.co/z4xBFyQ/Group-1.png" alt="credit-logo" />
                </div>
            </div>
            </>
        )

    }

    renderHome=()=>{
        const {lastTranscations}=this.state
        return(
        <>
            {this.renderCreditDebitAmounts()}
            <h1 className="last-transcation">Last Transcation</h1>
            <div className="last-transcation-items">
            {lastTranscations.map(transcation=>{
                return(
                    <LastTranscationItem key={transcation.id} transcation={transcation}/>
                    )
                })
            }
            </div>
        </>
        )

    }

    renderEmptyTranscations=()=> <>{this.renderCreditDebitAmounts()}<h1 className="empty-trans-heading">No Transactions Found</h1></>

    renderSwitch=()=>{
        const {pageStatus} = this.state
        switch(pageStatus){
            case pageStatusData.loading:
                return <div className="dashboard-home"><TailSpin color="red" height={50}/></div>
            case pageStatusData.success:
                return this.renderHome()
            case pageStatusData.noData:
                return this.renderEmptyTranscations()
            default:
                return <div className="dashboard-home"><h1>SomeThing Went Wrong</h1></div>
        }
    }

    render(){
        const {isLoading} = this.state;
        return(
        <>
            {this.renderSwitch()}
        </>
        )
    }
}

export default DashBoard