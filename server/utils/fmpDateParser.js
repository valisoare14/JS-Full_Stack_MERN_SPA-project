function fmpDateParser(sDate){
    const year=sDate.substring(0,4)
    const month=sDate.substring(5,7)
    const day=sDate.substring(8,10)
    const hour=sDate.substring(11,13)
    const minute=sDate.substring(14,16)
    const seconds=sDate.substring(17,19)

    const date=new Date(year,month-1,day,hour,minute,seconds)
    return date
}

module.exports={fmpDateParser}