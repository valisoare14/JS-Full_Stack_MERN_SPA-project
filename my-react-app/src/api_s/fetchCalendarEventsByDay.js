async function fetchCalendarEventsByDay(day,weeksBack,weeksFront){
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_SERVER}calendar/${day}/${weeksBack}/${weeksFront}`)
        const result = await response.json()

        if(response.status !== 200){
            throw new Error(result.message)
        }

        return result.data
    } catch (error) {
        console.error(error)
    }
}

export {fetchCalendarEventsByDay}