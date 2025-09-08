import supabaseClient from "../config/supabaseClient"

const uploadImage=async(file, bucketName, bucketFolder,fileName)=>{
    const {data} = await supabaseClient.storage.from(bucketName).upload(`${bucketFolder}/${fileName}`,file)
}

export default uploadImage