import "./index.css"
import { Component } from "react"
import LastTranscationItem from "../LastTranscationItem/index"
import deleteTranscation from "../deleteTransaction"
import Cookies from "js-cookie"
import {TailSpin} from "react-loader-spinner"
const transactionTypeButtons =[
    {
        id:1,
        type:"all",
        buttonName:"All Transactions",
    },
    {
        id:2,
        type:"credit",
        buttonName:"Credit",
    },
    {
        id:3,
        type:"debit",
        buttonName:"Debit",
    }
]

const pageStatusData = {
    loading:"loading",
    success:"success",
    error:"error",
    noData:"noData"
}

const TransactionButton = props=>{
    const {data,activeTransButton,changeActiveTransButton}=props
    const {buttonName}=data
    const activeclassName = activeTransButton ? "active-trans-button":""
    const changeTrans=()=>{
            changeActiveTransButton(data.type)
        }
    return(
        <button onClick={changeTrans} className={`transaction-tpe-button ${activeclassName}`}>{buttonName}</button>
    )
}

class Transcation extends Component {

    state={activeTransButton:transactionTypeButtons[0].type,allTranscationsData:[],pageStatus:pageStatusData.loading}

    getAllTransactions=async()=>{
        try{
        const apiUrl = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=50&offset=0"
        const headers = {
            'content-type': 'application/json',
            "x-hasura-role":"user",
            "x-hasura-user-id": Cookies.get("user_id"),
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
          };
          
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const response = await fetch(apiUrl, requestOptions)
        const data = await response.json()
        if(data.transactions.length<1){
            this.setState({pageStatus:pageStatusData.noData})
        }
        else{
            this.setState({allTranscationsData:data.transactions,pageStatus:pageStatusData.success})
            console.log(data.transactions)
        }
    }catch(e){
        this.setState({pageStatus:pageStatusData.error})
    }
}

    componentDidMount(){
        this.getAllTransactions()
    }

    changeActiveTransButton= transButtonId =>{
        this.setState({activeTransButton:transButtonId})
    }

    callDeleteTranscation=async transId=>{
        this.setState({pageStatus:pageStatusData.loading})
        await deleteTranscation(transId)
        this.getAllTransactions()
    }

    renderTransactions=()=>{
        const {activeTransButton,allTranscationsData}=this.state
        let filteredTransData = allTranscationsData
        if (activeTransButton!==transactionTypeButtons[0].type) {
            filteredTransData = allTranscationsData.filter(each=>(
            each.type===activeTransButton
        ))
            }
        return(
        <div>
            {filteredTransData.map(each=>(
                <LastTranscationItem deleteTranscation={this.callDeleteTranscation} key={each.id} transcation={each}/>
            ))}
        </div>
        )
    }

    renderTransactionSwitch=()=>{
        const {pageStatus}= this.state
        switch(pageStatus) {
            case pageStatusData.loading:
                return <div className="dashboard-home"><TailSpin color="red" height={50}/></div>
            case pageStatusData.success:
                return this.renderTransactions()
            case pageStatusData.noData:
                return <h1 className="empty-trans-heading">No Transactions Found</h1>
            default:
                return <h1 className="error-loading">Something Went Wrong</h1>
        }
    }

    render(){
        const {activeTransButton}=this.state
        return(
                    <>
                    <div className="transcation-heading">
                        <h1>Transactions</h1>
                        <div>
                        {transactionTypeButtons.map(each=>
                            <TransactionButton key={each.id} changeActiveTransButton={this.changeActiveTransButton} activeTransButton={activeTransButton===each.type} data={each}/>
                        )}
                        </div>
                    </div>
                    {
                        this.renderTransactionSwitch()
                    }
                    </>
                )
    }
}

export default Transcation