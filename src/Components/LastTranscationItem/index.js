import "./index.css"

const LastTranscationItem = (props) =>{
    const {transcation} = props
    const {amount,category,date,id,transaction_name,type,user_id} = transcation
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

    </div>
    )
}

export default LastTranscationItem