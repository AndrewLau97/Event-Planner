import supabaseClient from "../config/supabaseClient";

const checkEventAttendees = async (setEventAttendees, userId) => {
  if (userId) {
    const { data } = await supabaseClient
      .from("eventAttendees")
      .select()
      .eq("userId", userId);
    if (data) {
      setEventAttendees(data);
    } else {
      setEventAttendees([]);
    }
  } else {
    const { data } = await supabaseClient.from("eventAttendees").select();
    if (data) {
      setEventAttendees(data);
    } else {
      setEventAttendees([]);
    }
  }
};

export default checkEventAttendees;
