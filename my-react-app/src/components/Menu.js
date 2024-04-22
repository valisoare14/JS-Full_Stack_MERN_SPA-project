import { useNavigate } from "react-router-dom"

function Menu(){
    const navigate=useNavigate()
    return(
        <div className="fixed left-0 top-16.4 h-[calc(100vh-4.15rem)] w-1/5 bg-green-600 mt-1 rounded-md flex flex-col items-center">
            <button className="menu-item" onClick={()=>{navigate('/')}}>
                <img src="/icos/bar-chart-line.svg" alt="Markets logo" className="symbol"/> <span className="menu-item-text">Markets</span>
            </button>
            <button className="menu-item" onClick={()=>{navigate('/news')}}>
                <img src="/icos/newspaper-line.svg" alt="News logo" className="symbol"/> <span className="menu-item-text">News</span>
            </button>
            <button className="menu-item" onClick={()=>navigate('/calendar')}>
                <img src="/icos/calendar.svg" alt="Calendar logo" className="symbol"/> <span className="menu-item-text">Calendar</span>
            </button>
            <button className="menu-item" onClick={()=>navigate('/portfolio')}>
                <img src="/icos/portfolio.svg" alt="Portfolio logo" className="symbol"/> <span className="menu-item-text">Portfolio</span>
            </button>
            <button className="menu-item" >
                <img src="/icos/analysis.svg" alt="Analysis logo" className="symbol"/> <span className="menu-item-text">Analysis</span>
            </button>
            <button className="menu-item" onClick={()=>navigate('/marketsentiment')}>
                <img src="/icos/sentiment.svg" alt="Sentiment logo" className="symbol"/> <span className="menu-item-text ">Sentiment</span>
            </button>
            <button className="menu-item"  onClick={()=>{navigate('/account')}}>
                <img src="/icos/account.svg" alt="Account logo" className="symbol"/> <span className="menu-item-text">Account</span>
            </button>
            <button className="menu-item" onClick={()=>{navigate('/watchlist')}}>
                <img src="/icos/watchlist_icos/bookmark-star.svg" alt="Watchlist logo" className="symbol"/> <span className="menu-item-text">Watchlist</span>
            </button>
            <button className="menu-item" onClick={()=>{navigate('/calculator')}}>
                <img src="/icos/calculator.svg" alt="Calculator logo" className="symbol"/> <span className="menu-item-text">Calculator</span>
            </button>
            <button className="menu-item" >
                <img src="/icos/education.svg" alt="Education logo" className="symbol"/> <span className="menu-item-text">Education</span>
            </button>
            <button className="menu-item" onClick={()=>navigate('/alerts')}>
                <img src="/icos/alert.svg" alt="Alerts logo" className="symbol"/> <span className="menu-item-text">Alerts</span>
            </button>              
        </div>
    )
}
export default Menu