import { Component } from "react"
import Cookies from "js-cookie"
import "./index.css"
import LastTranscationItem from "../LastTranscationItem/index"
import { TailSpin } from "react-loader-spinner"
import deleteTranscation from "../deleteTransaction"
import Modal from "react-modal"

const pageStatusData ={
    loading:"loading",
    success:"success",
    error:"error",
    noData:"noData",
}

export class DashBoard extends Component {
    state = {creditAmount: 0,debitAmount: 0,lastTranscations:[],pageStatus:pageStatusData.loading,showAddTrans:false,showConfirmPopup:false,
    addTransName:"",addTransType:"",addCategory:"",addAmount:0,addDate:""
    }

    callDeleteTranscation= async TransId=>{
        this.setState({pageStatus:pageStatusData.loading})
        await deleteTranscation(TransId)
        window.location.reload()
    }

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

    onClickAddTrans=()=>{
        this.setState({showAddTrans:true})
    }
    closeAddTransPopup=()=>{
        this.setState({showAddTrans:false})
    }

    confirmAddTranscation=async event=>{
        event.preventDefault()
        const {addTransName,addAmount,addCategory,addDate,addTransType}= this.state
        const apiUrl = 'https://bursting-gelding-24.hasura.app/api/rest/add-transaction';
        const headers = {
        'content-type': 'application/json',
        "x-hasura-role":"user",
        "x-hasura-user-id":Cookies.get("user_id"),
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        };

        const addData={
            "name": addTransName,
            "type": addTransType,
            "category": addCategory,
            "amount": addAmount,
            "date": addDate,
            "user_id": Cookies.get("user_id"),
        }

        const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(addData)
        };

        await fetch(apiUrl, requestOptions)
        this.closeAddTransPopup()
        this.setState({showConfirmPopup:true})
    }

    renderCreditDebitAmounts=()=>{
        const {creditAmount,debitAmount,showConfirmPopup}= this.state
        return(
            <>
            <div className="accounts-header">
                <h1 className="accounts-heading">Accounts</h1>
                <button onClick={this.onClickAddTrans} className="add-transcation-button">+ Add Transcation</button>
                <Modal className="logout-popup" isOpen={showConfirmPopup}>
                    <div className="add-transcation-success-popup">
                        <h1 className="add-transcation-success-message">Transaction Added Successfully</h1>
                        <button className="add-transcation-button" onClick={()=> {this.setState({showConfirmPopup:false}); window.location.reload()}}>Close</button>
                    </div>
                </Modal>
                <Modal className="logout-popup transaction-popup" isOpen={this.state.showAddTrans}>
                    <form onSubmit={this.confirmAddTranscation} className="modal-elements">
                        <div className="add-close-head">
                        <h1 className="add-trans-heading">Add Transaction</h1>
                        <button className="close-popup" onClick={this.closeAddTransPopup}>X</button>
                        </div>
                    <h2 className="trans-type-head">Transaction Name</h2>
                    <input onChange={(e)=> this.setState({addTransName:e.target.value})} type="text" placeholder="Enter Transaction Name" className="add-transcation-input"/>
                    <h2 className="trans-type-head">Transaction Type</h2>
                    <select onChange={(e)=> this.setState({addTransType:e.target.value})} className="add-transcation-input">
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                    <h2 className="trans-type-head">Category</h2>
                    <select onChange={(e)=> this.setState({addCategory:e.target.value})} className="add-transcation-input">
                        <option value="food">Food</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                    </select>
                    <h2 className="trans-type-head">Amount</h2>
                    <input onChange={(e)=> this.setState({addAmount:e.target.value})} type="number" placeholder="Enter Amount" className="add-transcation-input"/>
                    <h2 className="trans-type-head">Date</h2>
                    <input onChange={(e)=> this.setState({addDate:e.target.value})} type="date" placeholder="Enter Date" className="add-transcation-input"/>
                    <button className="add-transcation-button" type="submit">Add Transaction</button>
                    </form>
                </Modal>
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
                    <LastTranscationItem key={transcation.id} deleteTranscation={this.callDeleteTranscation} transcation={transcation}/>
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
        return(
        <>
            {this.renderSwitch()}
        </>
        )
    }
}
