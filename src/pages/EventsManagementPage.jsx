import { useEffect, useState } from "react";
import CreateEvent from "../components/CreateEvent";
import getAllEvents from "../hooks/useGetAllEvents";
import supabaseClient from "../config/supabaseClient";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import filterOutEvents from "../utils/filterOutEvents";

const EventsManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents,setFilteredEvents]=useState([])
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [showFadeIn, setShowFadeIn] = useState(false);
  const navigate=useNavigate()

  function editPage(event) {
    navigate("/eventPage", { state: { event, edit:true } });
  }

  useEffect(() => {
    const start = async () => {
      await getAllEvents(setEvents);
      setFilteredEvents(events);
      filterOutEvents(events, setFilteredEvents, true);
      setHiddenLoading(false);
    };
    start();
    const channel = supabaseClient
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (_payload) => {
          getAllEvents(setEvents);
        }
      )
      .subscribe();
    if (!hiddenLoading) {
      const timer = setTimeout(() => {
        setShowFadeIn(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        supabaseClient.removeChannel(channel);
      };
    } else {
      return () => {
        supabaseClient.removeChannel(channel);
      };
    }
  }, [hiddenLoading]);
  return (
    <>
      <div
        className="text-charcoal pt-10"
      >
        <div className="flex justify-center">
          <h1 className="text-5xl font-bold mb-10">Create An Event</h1>
        </div>
        <div>
          <CreateEvent />
        </div>
        <div className="bg-powderblue pt-10 min-h-140">
          <div className="flex justify-center mb-10">
            <h1 className="text-5xl font-bold">Edit Current Events</h1>
          </div>

          <div
            className={`flex justify-center  ${
              hiddenLoading ? "animate-fade-in-scale" : "animate-fade-out-scale"
            }`}
          >
            <Lottie animationData={Loading} className="w-100 h-100" />
          </div>

          <div
            className={`flex justify-center flex-wrap ${
              hiddenLoading
                ? `hidden`
                : showFadeIn
                ? "animate-fade-in-scale"
                : "hidden"
            }`}
          >
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                // className="mx-10 rounded-2xl shadow-sm shadow-dark-mild mb-10"
                className="mx-10 rounded-2xl shadow-sm shadow-dark-mild rounded-2xl w-100 bg-beige relative z-0 lg:my-10 my-5 hover:bg-mediumbeige transition-transform duration-300 ease-in-out hover:translate-y-1"
                onClick={() => {
                  editPage(event);
                }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsManagementPage;
