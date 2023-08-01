import Modal from "react-modal"
import {Component} from "react"
import "./index.css"

class LastTranscationItem extends Component{

    state ={showPopUp:false}

    onClickDelete=()=>{
        this.setState({showPopUp:true})
    }

    denyDelete=()=>{
        this.setState({showPopUp:false})
    }

    onClickConfirmDelete=()=>{
        const {deleteTranscation,transcation}=this.props
        const {id}=transcation
        this.setState({showPopUp:false})
        deleteTranscation(id)
    }

    render() {
    const {showPopUp} = this.state
    const {transcation} = this.props
    const {amount,category,date,transaction_name,type} = transcation
    const options = {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const transcationName =  transaction_name.charAt(0).toUpperCase() + transaction_name.slice(1);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const formattedDate = new Date(date).toLocaleString('en-US',options)
    const arrowClassName = type==="credit"? "fa-circle-arrow-up credit-icon":"debit-icon fa-circle-arrow-down"
    const amountClassName = type==="credit"? "credit-transcation-amount":"debit-transcation-amount"
    const currencySymbol = type==="credit"? "+":"-"
    return(
    <div className="transcation-item">
        <i className={`transcation-icon fa-solid ${arrowClassName}`}></i>
        <h1 className="transcation-name">{transcationName}</h1>
        <p className="transcation-category">{categoryName}</p>
        <p className="transcation-date">{formattedDate}</p>
        <p className={`transcation-amount ${amountClassName}`}>{currencySymbol}${amount}</p>
        <button onClick={this.onClickDelete} className="delete-button"><i class="fa-solid fa-trash-can"></i></button>
        <Modal className="logout-popup" isOpen={showPopUp} onRequestClose={this.denyDelete}>
                <div className="logut-buttons-sections">
                    <i className="confirm-logout-icon fa-solid fa-triangle-exclamation"></i>
                    <h2>Are You Sure To Want To Delete?</h2>
                <div className="pop-up-buttons">
                    <button className="pop-up-logout" onClick={this.onClickConfirmDelete}>Yes, Delete</button>
                    <button className="pop-up-cancel-button" onClick={this.denyDelete}>No,Leave it</button>
                </div>
                </div>
        </Modal>

    </div>
    )
}
}

export default LastTranscationItem