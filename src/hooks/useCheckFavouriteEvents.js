import supabaseClient from "../config/supabaseClient";

const checkFavouriteEvents = async (setFavourites) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (user) {
    const { data, error } = await supabaseClient
      .from("eventFavourites")
      .select("eventId")
      .eq("userId", user.id);
    if (data) {
      setFavourites(data);
    } else {
      setFavourites([]);
    }
  }
};

export default checkFavouriteEvents;
