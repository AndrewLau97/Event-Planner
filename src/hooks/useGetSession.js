import supabaseClient from "../config/supabaseClient"

const getSession=async(setSession)=>{
    const {data:{session}}= await supabaseClient.auth.getSession()
    setSession(session)
}


export default getSession