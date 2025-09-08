function sortDateInfo(date,setInfo){
    const day=date.toDateString();
    let hour=date.getHours();
    const minutes=date.getMinutes()
    const suffix = hour>=12?"pm":"am";
    hour=((hour+11)%12)+1;
    setInfo({date:day,time:`${hour}:${minutes}`, suffix})
  }

  export default sortDateInfo