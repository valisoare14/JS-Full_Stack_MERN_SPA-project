import { Link } from "react-router-dom"

function New(params){
    const {item}=params
    return(
        <div className="flex flex-col h-screen/2border border-black border-2 rounded-md w-full md:w-144 mb-2">
            <div className=" rounded-tl-md w-full h-5/6 xxs:p-1">
                <img src={`${item.banner}`} className="rounded-md xs:float-right h-32 w-auto"/>
                <div className="flex flex-col h-full text-xxs md:text-sm p-1">
                    <div className="flex flex-col justify-evenly gap-1">
                        <p class="rounded-tl-md text-black font-bold overflow-hidden text-center">{item.title}</p>
                        <p className="md:text-xs">date: {item.time_published}</p>
                        <p className="flex md:text-xs">authors: {item.authors.length>1?item.authors.map(element=>(<span className="pl-1 underline decoration-sky-500 ">{element}</span>)):(<span className="underline decoration-sky-500 pl-1">{item.authors[0]}</span>)}</p>
                        <p className="flex md:text-xs">topics: {
                        item.topics
                        && 
                        item.topics.length==1
                        ?
                        <span className="ml-1 underline decoration-sky-500 inline">{item.topics[0]}</span>
                        :
                        item.topics.map(element=>(<span className="ml-1 underline decoration-sky-500 inline">{element}</span>))
                        }
                        </p>
                        <p className="indent-8"><i>{item.summary}</i></p>
                    </div>
                </div>
            </div>

           <div className="flex w-full justify-around items-start h-1/6 rounded-bl-md rounded-br-md text-xxs md:text-sm p-2">
                <p className="align-middle">SENTIMENT: {item.sentiment}</p>
                <p className="underline decoration-sky-500">source: {item.source}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="truncate">read mode :<img src="/icos/www.svg" className="w-5 h-5 inline"/></a>
           </div>
        </div>
    )
}

export default New