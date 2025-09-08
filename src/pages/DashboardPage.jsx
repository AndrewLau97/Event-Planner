import { useEffect, useState } from "react";
import checkProfileExists from "../hooks/useCheckProfileExists";
import { useNavigate } from "react-router-dom";
import getOwnUserInfo from "../hooks/useGetOwnUserInfo";
import supabaseClient from "../config/supabaseClient";
import filteredEvents from "../hooks/useGetFilteredEvents";
import EventCard from "../components/EventCard";
import { Facebook } from "react-content-loader";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import DeleteSavedEvent from "../hooks/useDeleteSavedEvent";
import sortDateInfo from "../utils/sortDateInfo";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profileExists, setProfileExists] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [showFadeIn, setShowFadeIn] = useState(false);
  const [favEvents, setFavEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [date,setDate]=useState({})

  useEffect(() => {
    const start = async () => {
      await filteredEvents(setFavEvents, "eventFavourites");
      await filteredEvents(setAttendingEvents, "eventAttendees");
      await checkProfileExists(setProfileExists);
      await getOwnUserInfo(setUserInfo);
      sortDateInfo(new Date(userInfo.created_at),setDate)
      setHiddenLoading(false);
    };
    start();
    const dashboardChannel = supabaseClient
      .channel("dashboardChannel")
      .on(
        "postgres_changes",
        { event: "update", schema: "public", table: "userProfiles" },
        (_payload) => {
          getOwnUserInfo(setUserInfo);
        }
      )
      .on(
        "postgres_changes",
        { event: "delete", schema: "public", table: "eventAttendees" },
        (_payload) => {
          filteredEvents(setAttendingEvents, "eventAttendees");
        }
      )
      .on(
        "postgres_changes",
        { event: "delete", schema: "public", table: "eventFavourites" },
        (_payload) => {
          filteredEvents(setFavEvents, "eventFavourites");
        }
      )
      .subscribe();
      
    if (!hiddenLoading) {
      const timer = setTimeout(() => {
        setShowFadeIn(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        supabaseClient.removeChannel(dashboardChannel);
      };
    } else {
      return () => {
        supabaseClient.removeChannel(dashboardChannel);
      };
    }
  }, [profileExists, hiddenLoading]);
  async function applyToBeOrganiser() {
    const { data } = await supabaseClient
      .from("userProfiles")
      .update({ role: "pending" })
      .eq("id", userInfo.id)
      .select();
  }

  async function readMessage() {
    const { data } = await supabaseClient
      .from("userProfiles")
      .update({ adminMessage: null })
      .eq("id", userInfo.id)
      .select();
  }
  if (hiddenLoading) {
    return <></>;
  } else {
    if (!profileExists) {
      navigate("/createProfilePage");
      return <></>;
    } else {
      return (
        <>
          <div className="text-charcoal">
            <div className="flex flex-col lg:flex-row mx-10 justify-evenly">
              <div className="mt-5 lg:w-1/3 bg-mediumbeige rounded-2xl shadow-md w-full">
                <div
                  className={`flex mx-5 ${
                    hiddenLoading
                      ? "animate-fade-in-scale"
                      : "animate-fade-out-scale"
                  }`}
                >
                  <Facebook />
                </div>
                <div
                  className={`flex justify-start flex-wrap ${
                    hiddenLoading
                      ? `hidden`
                      : showFadeIn
                      ? "animate-fade-in-scale"
                      : "hidden"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex">
                      <div className="w-60">
                        <img
                          src={
                            userInfo.profilePicture
                              ? `https://xgrtcjeypivgpykqszjq.supabase.co/storage/v1/object/public/eventMedia/${userInfo.id}/${userInfo.profilePicture}`
                              : "NoProfilePic.jpg"
                          }
                          className="rounded-full"
                        />
                      </div>
                      <div className=" w-full flex flex-col justify-center pl-10">
                        <div className="">
                          <p>
                            Name: {userInfo.firstName} {userInfo.lastName}
                          </p>
                          <p>Role: {userInfo.role}</p>
                          {userInfo.role === "member" && (
                            <button
                            className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 py-2 hover:cursor-pointer"
                            onClick={applyToBeOrganiser}
                            >
                              Apply for Organiser
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                      <div className="flex justify-center">
                        <p className="m-2">Member since: {date.date}</p>
                      </div>
                  </div>
                </div>
              </div>
              <div className="bg-mutedwhite p-3 border-1 rounded-2xl lg:w-1/3 w-full mt-5">
                <h2>Admin Message: </h2>
                {userInfo.adminMessage && (
                  <div className="h-4/5 lg:h-9/10 flex flex-col justify-between">
                    <div>
                      <p>{userInfo.adminMessage.message}</p>
                      {userInfo.adminMessage.followUp && (
                        <p>{userInfo.adminMessage.followUp}</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={readMessage}
                        className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer mt-2"
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="border-1 bg-powderblue m-10 p-5 rounded-xl min-h-132">
                <div className="flex justify-center">
                  <h1 className="text-3xl font-bold">Your Quest List</h1>
                </div>
                <div
                  className={`flex justify-center ${
                    hiddenLoading
                      ? "animate-fade-in-scale"
                      : "animate-fade-out-scale"
                  }`}
                >
                  <Lottie animationData={Loading} className="w-112 h-112" />
                </div>
                <div
                  className={`flex justify-start flex-wrap ${
                    hiddenLoading
                      ? "hidden"
                      : showFadeIn
                      ? "animate-fade-in-scale"
                      : "hidden"
                  }`}
                >
                  {attendingEvents.map((event) => (
                    <div
                      key={event.id}
                      // className="mx-5 rounded-2xl shadow-sm shadow-dark-mild rounded-2xl w-100 bg-beige lg:my-10 my-5"
                      className="mx-10 rounded-2xl shadow-sm shadow-dark-mild rounded-2xl w-100 bg-beige relative z-0 lg:my-10 my-5 hover:bg-mediumbeige transition-transform duration-300 ease-in-out hover:translate-y-1"
                    >
                      <EventCard event={event} />
                      <button
                        className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer"
                        onClick={() => {
                          DeleteSavedEvent(
                            userInfo.id,
                            event.id,
                            "eventAttendees"
                          );
                        }}
                      >
                        Forfeit Quest
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-1 bg-sagegreen m-10 p-5 rounded-xl min-h-132">
                <div className="flex justify-center">
                  <h1 className="text-3xl font-bold">Tracked Quests</h1>
                </div>
                <div
                  className={`flex justify-center ${
                    hiddenLoading
                      ? "animate-fade-in-scale"
                      : "animate-fade-out-scale"
                  }`}
                >
                  <Lottie animationData={Loading} className="w-112 h-112" />
                </div>
                <div
                  className={`flex justify-start flex-wrap ${
                    hiddenLoading
                      ? "hidden"
                      : showFadeIn
                      ? "animate-fade-in-scale"
                      : "hidden"
                  }`}
                >
                  {favEvents.map((event) => (
                    <div
                      key={event.id}
                      // className="mx-5 rounded-2xl shadow-sm shadow-dark-mild p-5 rounded-2xl w-100 bg-beige lg:my-10 my-5"
                      className="mx-10 rounded-2xl shadow-sm shadow-dark-mild rounded-2xl w-100 bg-beige relative z-0 lg:my-10 my-5 hover:bg-mediumbeige transition-transform duration-300 ease-in-out hover:translate-y-1"
                    >
                      <EventCard event={event} />
                      <button
                        className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer"
                        onClick={() => {
                          DeleteSavedEvent(
                            userInfo.id,
                            event.id,
                            "eventFavourites"
                          );
                        }}
                      >
                        Untrack Quest
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
};

export default DashboardPage;
