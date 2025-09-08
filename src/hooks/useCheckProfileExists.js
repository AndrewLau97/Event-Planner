import supabaseClient from "../config/supabaseClient";

const checkProfileExists = async (setProfileExists) => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (user) {
      const { data } = await supabaseClient
        .from("userProfiles")
        .select("*, users!inner(*)")
        .eq("users.id", user.id);
      if (data.length) {
        setProfileExists(true);
      }else{
        setProfileExists(false)
      }
    }
  };

  export default checkProfileExists