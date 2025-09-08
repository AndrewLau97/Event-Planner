import checkAttendingAmount from "../hooks/useCheckAttendingAmount";

async function filterOutEvents(events,setEvents,normal) {
   async function checkCapacity() {
    const results = await Promise.all(
      events.map(async (event) => {
        const result = await checkAttendingAmount(event.id, event.maxCapacity);
        return { event, result };
      })
    );
    return results.filter(({result})=>result).map(({event})=>event)
  }
  const newEvents=await checkCapacity()
  const filterEvents = newEvents.filter((event) => 
    new Date(event.date)>=new Date()
  );
  if(normal){
    setEvents(filterEvents)
  }else{
    setEvents(newEvents)
  }
}

export default filterOutEvents;
