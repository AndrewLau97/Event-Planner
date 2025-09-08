import supabaseClient from "../config/supabaseClient";


const getUserId = async (setUserId) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if(user){
    setUserId(user.id)
  }else{setUserId(null)}
};

export default getUserId