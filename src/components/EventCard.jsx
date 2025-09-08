import { useEffect, useState } from "react";
import sortDateInfo from "../utils/sortDateInfo";

const EventCard = ({event}) => {
  const [dateData,setDateData]=useState({date:"",time:"",suffix:""})
    const date = new Date(event.date);
    useEffect(()=>{
      sortDateInfo(date,setDateData)
    },[])
  
  return (
    <>
      <div>
        <img
          src={`https://xgrtcjeypivgpykqszjq.supabase.co/storage/v1/object/public/eventBanner/${event.id}/${event.bannerPicture}`}
          className="w-full h-64 object-cover rounded-2xl mb-5"
        />
        <div className="mx-5">
          <h1 className="text-2xl italic mb-2 ml-1">{event.name}</h1>
          <div className="font-georgia flex items-center mb-2">
            <img src="Calendar.png"/>
            <p>{dateData.date}</p>
            <img src="Clock.png"/>
            <p>{dateData.time} {dateData.suffix}</p>
          </div>
          <p className="text-xs text-grey-400 mb-2 ml-1">{event.location}</p>
          <p className="ml-1 font-georgia flex justify-end mb-5">{event.price?`£${event.price}`:"Free"}</p>
        </div>
      </div>
    </>
  );
};

export default EventCard;
