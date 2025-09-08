import { useEffect, useState } from "react";
import checkProfileExists from "../hooks/useCheckProfileExists";
import { Navigate, useNavigate } from "react-router-dom";
import useCheckSession from "../hooks/useCheckSession";

const Homepage = () => {
  const [profileExists,setProfileExists]=useState(false)
  const [hiddenLoading,setHiddenLoading]=useState(true)
  const session = useCheckSession()
  const navigate=useNavigate()
  useEffect(()=>{
    const start=async()=>{
      await checkProfileExists(setProfileExists)
      setHiddenLoading(false)
    }
    start()
  },[hiddenLoading])

  function goToPage(page){
    navigate(page)
  }
  
  function goToAboutPage(){
   navigate("/aboutPage") 
  }

  function goToEventsPage(){
    nagivate("/allEventsPage")
  }


  if(hiddenLoading){
    return <></>
  }else if(session&&!profileExists){
    return <Navigate to="/createProfilePage" />;
  }
  else{
    return (
      <>
      <div
        className="text-charcoal min-h-212 bgimg"
        >
        <div className="py-50 mx-5">
          <div className="bg-beige max-w-200 mx-auto rounded-3xl shadow-md">
            <div className="flex justify-center mx-5">
              <h1 className="text-3xl text-center mx-5 py-5">Adventure is better together - its dangerous to go alone ⚔️ </h1>
            </div>
            <p className="mx-5 mb-5">Quest Together connects players to experiences they'll love — from casual game nights to epic tournaments, we call them Quests.</p>
            <p className="mx-5 mb-5 text-xl">✨ Why Quest Together?</p>
            <p className="mx-5">
            At Quest Together, every event is a Quest. We make it easy to discover new adventures, connect with fellow players, and even create your own quests for others to enjoy. Whether you're seeking casual fun or competitive challenges, our platform brings people together through shared gaming experiences.
            </p>
            <div className="flex justify-between mx-5 pb-5 pt-5">
              <div className=" flex">
                <p>📜</p><button onClick={()=>{goToPage("/allEventsPage")}} className="hover:cursor-pointer hover:underline">View Available Quests</button>
              </div>
              <div className="flex">
                <p>👉 </p><button onClick={()=>{goToPage("/aboutPage")}} className="hover:cursor-pointer hover:underline">Learn more about us</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
};

export default Homepage;
