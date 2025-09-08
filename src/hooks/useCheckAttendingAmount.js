import supabaseClient from "../config/supabaseClient";

const checkAttendingAmount = async (eventId, maxCapacity) => {
  const { data } = await supabaseClient
    .from("eventAttendees")
    .select()
    .eq("eventId", eventId);
    if(data){
        if(data.length<maxCapacity){
            return true
        }else{
            return false
        }
    }
};

export default checkAttendingAmount;
