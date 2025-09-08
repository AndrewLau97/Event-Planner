import supabaseClient from "../config/supabaseClient";

const DeleteSavedEvent = async (userId, eventId, table) => {
  const { data } = await supabaseClient
    .from(table)
    .delete()
    .eq("eventId", eventId)
    .eq("userId", userId);
};

export default DeleteSavedEvent;
