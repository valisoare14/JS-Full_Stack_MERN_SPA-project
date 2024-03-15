const Calendar = require('../databases/Calendar')
const {fmpApiCalendarRangeBack,fmpApiCalendarRangeFront}=require('../utils/fmpApiCalendarRange')
const {fmpDateParser}=require('../utils/fmpDateParser')

async function fetchCalendarEvents(weeksBack,weeksFront){
    try {
        const response = await fetch(`${process.env.FMP__BASE_URL}economic_calendar?from=${fmpApiCalendarRangeBack(weeksBack)}&to=${fmpApiCalendarRangeFront(weeksFront)}&apikey=${process.env.FMP_API_KEY}`)
        const result = await response.json()
        if(!response.ok){
            throw new Error(result["Error Message"])
        }
        const dataPromises=result.map(async (element) => {
            const obs=await new Calendar({
                date: fmpDateParser(element.date),
                country: element.country,
                event: element.event,
                currency: element.currency,
                previous: (element.previous !==null ?Number(element.previous):null),
                estimate: (element.estimate !==null ?Number(element.estimate):null),
                actual: (element.actual !==null ? Number(element.actual):null),
                change: (element.change !==null ? Number(element.change):null),
                impact: element.impact,
                changePercentage: (element.changePercentage !==null ?Number(element.changePercentage):null),
                timestamp:Date.now()
            }).save()
            return obs
        })
        const data = await Promise.all(dataPromises)
        return data
    } catch (error) {
        console.error(error)
    }
   
}

module.exports={fetchCalendarEvents}