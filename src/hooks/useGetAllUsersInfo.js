import supabaseClient from "../config/supabaseClient";

const getAllUsersInfo = async (setUsers, role) => {
  const { data } = await supabaseClient
    .from("userProfiles")
    .select("*")
    .eq("role", role);
  if (data.length) {
    setUsers(data);
  }
  else{
    setUsers([])
  }
};

export default getAllUsersInfo;
