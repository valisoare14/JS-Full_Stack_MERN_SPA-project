import { useEffect, useState } from "react";
import {PieChart,Pie,Tooltip, Cell} from "recharts";

function PortfolioAssetsDistributionPieChart({portfolioAssets}){
    const [data , setData] = useState([])
    const [loading , setLoading] = useState(false)
    const COLORS =["#0088FE", "#00C49F", "#FFBB28" ,"#FF8042"];
    useEffect(()=>{
        setLoading(true)
        const total = portfolioAssets.reduce((s,pa) => s+= pa.quantity * pa.current_price,0)
        setData(portfolioAssets.map(el => ({
            ...el,
            value : (el.quantity * el.current_price),
            percent : `${el.symbol} ${((el.quantity * el.current_price*100)/total).toFixed(2)}%`,
            color : COLORS[portfolioAssets.map(e=>e._id).indexOf(el._id) % COLORS.length]
        })))
        setLoading(false)
    },[])
    return(
        <>
            {!loading &&
            <>
            <div className="flex items-center justify-around">
                <PieChart width={300} height={200} className="block xxs:hidden">
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={data}
                        cx={138}
                        cy={100}
                        outerRadius={90}
                        fill="#8884d8"
                        label ={({percent})=>percent}
                    >
                    {data.map(el => 
                        <Cell key={el._id} fill={COLORS[data.map(e=>e.value).indexOf(el.value) % COLORS.length]}/>
                    )}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <PieChart width={500} height={400} className="hidden xxs:block">
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={data}
                        cx={240}
                        cy={200}
                        outerRadius={128}
                        fill="#8884d8"
                        label ={({percent})=>percent}
                    >
                    {data.map(el => 
                        <Cell key={el._id} fill={COLORS[data.map(e=>e.value).indexOf(el.value) % COLORS.length]}/>
                    )}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div className="hidden xs:block flex flex-col justify-evenly h-full">
                    {data.map(el => <div style={{color : el.color}} className="text-center">
                        {el.symbol} {(el.value).toFixed(2)}$
                    </div>)}
                </div>
            </div>
            <div className="block xs:hidden flex flex-col justify-evenly mb-4">
                {data.map(el => <div style={{color : el.color}} className="text-center">
                    {el.symbol} {(el.value).toFixed(2)}$
                </div>)}
            </div>
            </>
            }
        </>
    )
}

export default PortfolioAssetsDistributionPieChart