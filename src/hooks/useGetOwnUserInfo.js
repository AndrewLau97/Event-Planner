import supabaseClient from "../config/supabaseClient";

const getOwnUserInfo = async (setUserInfo) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (user) {
    const { data } = await supabaseClient
      .from("userProfiles")
      .select("*")
      .eq("id", user.id);
    if (data.length) {
      setUserInfo(data[0]);
    }
  }
};

export default getOwnUserInfo;
