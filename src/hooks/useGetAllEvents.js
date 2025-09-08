import supabaseClient from "../config/supabaseClient";

const getAllEvents = async (setEvents) => {
  const { data } = await supabaseClient.from("events").select("*");
  if (data.length) {
    const sortedEvents = data.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    setEvents(sortedEvents);
  } else {
    setEvents([]);
  }
};
export default getAllEvents;
