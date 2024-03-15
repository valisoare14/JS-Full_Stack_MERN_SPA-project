function dateParser(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hours = dateString.substring(9, 11);
    const minutes = dateString.substring(11, 13);
    const seconds = dateString.substring(13, 15);

    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  
    return date;
}
module.exports={dateParser}
  