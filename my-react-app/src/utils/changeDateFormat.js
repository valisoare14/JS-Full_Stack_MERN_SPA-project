function changeDateFormat(stringDate) {
    const date = new Date(stringDate)
    const year=date.getFullYear().toString()
    const month=(date.getMonth()+1).toString().padStart(2,'0')
    const day=date.getDate().toString().padStart(2,'0')
    const hour = date.getHours().toString().padStart(2,'0')
    const minutes = date.getMinutes().toString().padStart(2,'0')

    return `${year}-${month}-${day}  ${hour}:${minutes}`
}

export {changeDateFormat}