import supabaseClient from "../config/supabaseClient"

const checkRole=async(setProfileRole)=>{
    const{data:{user}}=await supabaseClient.auth.getUser()
    if(user){
         const { data } = await supabaseClient
        .from("userProfiles")
        .select("role, users!inner(*)")
        .eq("users.id", user.id);
        if(data.length){
            setProfileRole(data[0].role)
        }
    }else{
        setProfileRole(null)
    }
}

export default checkRole