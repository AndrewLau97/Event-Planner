import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import sortDateInfo from "../utils/sortDateInfo";
import checkFavouriteEvents from "../hooks/useCheckFavouriteEvents";
import checkEventAttendees from "../hooks/useCheckEventAttendees";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import supabaseClient from "../config/supabaseClient";
import getUserId from "../hooks/useGetUserId";
import checkAttendingAmount from "../hooks/useCheckAttendingAmount";
import getSession from "../hooks/useGetSession";
import EventEdit from "../components/EditEvent";

const IndividualEventPage = () => {
  const location = useLocation();
  const { event, edit } = location.state || {};
  const [startDetails, setStartDetails] = useState({
    date: "",
    time: "",
    suffix: "",
  });
  const [endDetails, setEndDetails] = useState({
    date: "",
    time: "",
    suffix: "",
  });
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [showFadeIn, setShowFadeIn] = useState(null);
  const [checkAction, setCheckAction] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isFavourite, setIsFavourite] = useState([]);
  const [attending, setAttending] = useState([]);
  const [checkAddToCalendar, setCheckAddToCalendar] = useState(null);
  const [session, setSession] = useState(null);
  const [full, setFull] = useState(false);
  const startDate = new Date(event.date);
  const endDate = new Date(event.endDate);

  async function favouriteEvent() {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (user) {
      if (
        isFavourite.filter((favEvent) => favEvent.eventId === event.id).length
      ) {
        const { data } = await supabaseClient
          .from("eventFavourites")
          .delete()
          .eq("userId", user.id)
          .eq("eventId", event.id);
      } else {
        const { data } = await supabaseClient
          .from("eventFavourites")
          .insert({ userId: user.id, eventId: event.id });
      }
    } else {
      setCheckAction(true);
    }
  }

  async function joinEvent() {
    const canJoin = await checkAttendingAmount(event.id, event.maxCapacity);
    if (canJoin) {
      if (userId) {
        const attendEvent = { userId, eventId: event.id };
        if (event.price > 0) {
          attendEvent.paymentStatus = "pending";
        } else {
          attendEvent.paymentStatus = "paid";
        }
        const { data } = await supabaseClient
          .from("eventAttendees")
          .insert(attendEvent)
          .select();
        setCheckAddToCalendar(event);
      } else {
        setCheckAction(true);
      }
    } else {
      setFull(true);
    }
  }

  function cancelLogIn() {
    setCheckAction(false);
  }

  function goToLogIn() {
    setCheckAction(false);
    navigate("/loginPage");
  }

  async function addToCalendar() {
    let start = event.date
      .split("+")[0]
      .split("-")
      .join("")
      .split(":")
      .join("");
    let end = event.endDate
      .split("+")[0]
      .split("-")
      .join("")
      .split(":")
      .join("");
    const eventDetails = {
      summary: event.name,
      description: event.description,
      start: {
        dateTime: event.date,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    if (session.provider_token) {
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token,
          },
          body: JSON.stringify(eventDetails),
        }
      )
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log(data);
        });
    } else {
      window
        .open(
          `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventDetails.summary}&dates=${start}/${end}&details=${eventDetails.description}
`,
          "_blank"
        )
        .focus();
    }
    setCheckAddToCalendar(null);
  }

  function cancelAddToCalendar() {
    setCheckAddToCalendar(null);
  }

  useEffect(() => {
    const start = async () => {
      await checkFavouriteEvents(setIsFavourite);
      await checkEventAttendees(setAttending);
      await getUserId(setUserId);
      await getSession(setSession);
      sortDateInfo(startDate, setStartDetails);
      sortDateInfo(endDate, setEndDetails);
      setHiddenLoading(false);
    };

    start();

    const eventChannel = supabaseClient
      .channel("individualEventChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventFavourites" },
        (_payload) => {
          checkFavouriteEvents(setIsFavourite);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventAttendees" },
        (_payload) => {
          checkEventAttendees(setAttending);
        }
      )
      .subscribe();

    if (!hiddenLoading) {
      const timer = setTimeout(() => {
        setShowFadeIn(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        supabaseClient.removeChannel(eventChannel);
      };
    } else {
      return () => {
        supabaseClient.removeChannel(eventChannel);
      };
    }
  }, [hiddenLoading]);

  if (edit) {
    return <EventEdit event={event}/>;
  } else {
    return (
      <>
        <div
          className="text-charcoal min-h-212 border-1"
        >
          <div
            className={`flex justify-center ${
              hiddenLoading ? "animate-fade-in-scale" : "animate-fade-out-scale"
            }`}
          >
            <Lottie animationData={Loading} className="w-150 h-150 mb-100" />
          </div>
          <div
            className={`${
              hiddenLoading
                ? `hidden`
                : showFadeIn
                ? "animate-fade-in-scale"
                : "invisible"
            }`}
          >
            <img
              src={`https://xgrtcjeypivgpykqszjq.supabase.co/storage/v1/object/public/eventBanner/${event.id}/${event.bannerPicture}`}
              className="mx-auto h-120 object-cover w-4/5 my-10 rounded-2xl"
            />
            <div className="flex w-4/5 mx-auto justify-between">
              <div className="w-9/16">
                <p className="text-lg font-bold font-georgia">
                  {startDetails.date}
                </p>
                <p className="text-4xl font-bold mb-10">{event.name}</p>
                <div>
                  <p className="text-3xl mt-5 mb-3 font-bold">
                    Event Essentials
                  </p>
                  <p className="mb-1">
                    Event Duration: {startDetails.date} {startDetails.time}
                    {startDetails.suffix} - {endDetails.date} {endDetails.time}
                    {endDetails.suffix}
                  </p>
                  <p className="mb-1">Location: {event.location}</p>
                  <p className="mb-1">
                    Available Quest Holders (capacity): {event.maxCapacity}
                  </p>
                  <div className="flex mb-10">
                    <p>Tags:</p>
                    <div className="flex">
                      <p className="mx-2 bg-powderblue px-2 rounded-2xl">
                        {event.categoryType.gameType}
                      </p>
                      <p className="mx-2 bg-powderblue px-2 rounded-2xl">
                        {event.categoryType.platform}
                      </p>
                      <p className="mx-2 bg-powderblue px-2 rounded-2xl">
                        {event.categoryType.eventStyle}
                      </p>
                      <p className="mx-2 bg-powderblue px-2 rounded-2xl">
                        {event.categoryType.playerType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-20">
                  <p className="text-3xl mb-3 font-bold">About this Event</p>
                  <p>{event.description}</p>
                </div>
              </div>
              <div className="w-1/4">
                <div className="justify-end flex h-10">
                  {isFavourite.filter(
                    (favEvent) => favEvent.eventId === event.id
                  ).length ? (
                    <img
                      src="HeartFilled.png"
                      className=" hover:cursor-pointer"
                      onClick={favouriteEvent}
                    />
                  ) : (
                    <img
                      src="HeartOutline.png"
                      className=" hover:cursor-pointer"
                      onClick={favouriteEvent}
                    />
                  )}
                </div>
                {!attending.filter((attending) => {
                  return (
                    attending.eventId === event.id &&
                    attending.userId === userId
                  );
                }).length ? (
                  !attending.filter((attending) => {
                    return (
                      attending.eventId === event.id &&
                      attending.userId === userId
                    );
                  }).length < event.maxCapacity ? (
                    <button
                      onClick={joinEvent}
                      className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer"
                    >
                      Accept Quest
                    </button>
                  ) : (
                    <p>Full</p>
                  )
                ) : (
                  //
                  <p>attending</p>
                )}
                <p className="ml-1 flex justify-center text-2xl font-georgia">
                  {event.price ? `£${event.price}` : "Free"}
                </p>
              </div>
            </div>
          </div>
          <Dialog
            open={checkAction}
            onClose={() => setCheckAction(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
              <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
                <DialogTitle className="font-bold">Login Required</DialogTitle>
                <Description>
                  You are required to be logged in to access this feature
                </Description>
                <p>Would you like to log in?</p>
                <div className="flex justify-end gap-4">
                  <button
                    className="border-1 py-1 px-2 rounded-2xl bg-silver"
                    onClick={cancelLogIn}
                  >
                    No
                  </button>
                  <button
                    className="border-1 py-1 px-2 rounded-2xl bg-silver"
                    onClick={goToLogIn}
                  >
                    Yes
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
          <Dialog
            open={checkAddToCalendar !== null}
            onClose={() => setCheckAddToCalendar(null)}
            className="relative z-50"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
              <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
                <DialogTitle className="font-bold">Add to Calendar</DialogTitle>
                <Description>
                  Would you like to add this event into your calendar
                </Description>
                <div className="flex justify-end gap-4">
                  <button
                    className="border-1 py-1 px-2 rounded-2xl bg-silver"
                    onClick={cancelAddToCalendar}
                  >
                    No
                  </button>
                  <button
                    className="border-1 py-1 px-2 rounded-2xl bg-silver"
                    onClick={addToCalendar}
                  >
                    Yes
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
          <Dialog
            open={full}
            onClose={() => {
              setFull(false);
              setHiddenLoading(true);
            }}
            className="relative z-50"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
              <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
                <DialogTitle className="font-bold">Event Full</DialogTitle>
                <Description>Unfortunately this event is now full</Description>
                <button
                  className="border-1 py-1 px-2 rounded-2xl bg-silver"
                  onClick={() => {
                    setFull(false);
                    setHiddenLoading(true);
                  }}
                >
                  Okay
                </button>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      </>
    );
  }
};

export default IndividualEventPage;
