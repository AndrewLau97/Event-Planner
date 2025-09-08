import { v4 as uuidv4 } from "uuid";

const chooseFile=(e,setFile,updateFn,key,setPreview)=>{
    let file=e.target.files[0]
    if(file){
        setFile(file);
        const fileName=uuidv4()
        updateFn(key,fileName)
        setPreview(URL.createObjectURL(file))
    }
}

export default chooseFile