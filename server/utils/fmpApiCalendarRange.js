/**
 * 
 * @param {*} range specifies the range in weeks
 * @returns 
 */
function fmpApiCalendarRangeBack(weeks){
    const milisecondsBack=weeks*7*24*60*60*1000
    const date=new Date(Date.now()-milisecondsBack)
    const year=date.getFullYear().toString()
    const month=(date.getMonth()+1).toString().padStart(2,'0')
    const day=date.getDate().toString().padStart(2,'0')
    return `${year}-${month}-${day}`
}

function fmpApiCalendarRangeFront(weeks){
    const milisecondsBack=weeks*7*24*60*60*1000
    const date=new Date(Date.now()+ milisecondsBack)
    const year=date.getFullYear().toString()
    const month=(date.getMonth()+1).toString().padStart(2,'0')
    const day=date.getDate().toString().padStart(2,'0')
    return `${year}-${month}-${day}`
}
module.exports={fmpApiCalendarRangeBack,fmpApiCalendarRangeFront}