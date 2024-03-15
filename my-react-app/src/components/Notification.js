function Notification(props){
    const {message,timestamp}=props

    function extractHourAndMinute(dateString){
        let date = new Date(dateString);
        let hours = date.getHours().toString().padStart(2, '0'); 
        let minutes = date.getMinutes().toString().padStart(2, '0'); 
        let result = hours + ":" + minutes;
        return result
    }

    return(
        <li className="flex justify-between m-1 border-b-2 p-1 text-xxs sm:text-base"><span>{message}</span><span className="text-right">{extractHourAndMinute(timestamp)}</span></li>  
    )
}

export default Notification