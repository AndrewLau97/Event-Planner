import supabaseClient from "../config/supabaseClient";

const filteredEvents = async (setEvents,filter) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (user) {
    const { data } = await supabaseClient
      .from("events")
      .select(`*, ${filter}!inner(*)`)
      .eq(`${filter}.userId`, user.id);
    if (data) {
      setEvents(data);
    }else{
      setEvents([])
    }
  }
};

export default filteredEvents;
