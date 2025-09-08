import { useEffect, useState } from "react";
import getAllEvents from "../hooks/useGetAllEvents";
import EventCard from "../components/EventCard";
import getUserId from "../hooks/useGetUserId";
import checkFavouriteEvents from "../hooks/useCheckFavouriteEvents";
import supabaseClient from "../config/supabaseClient";
import checkEventAttendees from "../hooks/useCheckEventAttendees";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import getSession from "../hooks/useGetSession";
import filterOutEvents from "../utils/filterOutEvents";
import handleSelect from "../utils/handleSelect";
import DateTimePicker from "react-datetime-picker";
import checkAttendingAmount from "../hooks/useCheckAttendingAmount";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [eventAttendees, setEventAttendees] = useState([]);
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [showFadeIn, setShowFadeIn] = useState(false);
  const [checkAction, setCheckAction] = useState(false);
  const [checkAddToCalendar, setCheckAddToCalendar] = useState(null);
  const [session, setSession] = useState(null);
  const [filterBox, setFilterBox] = useState(false);
  const [chosenFilters, setChosenFilters] = useState({
    name: "",
    date: new Date(),
    endDate: "",
    price: "",
    categoryType: {
      gameType: "",
      platform: "",
      eventStyle: "",
      playerType: "",
    },
  });
  const [resetFilters, setResetFilters] = useState(false);
  const [full, setFull] = useState(false);
  const navigate = useNavigate();

  async function checkCapacity() {
    const results = await Promise.all(
      events.map(async (event) => {
        const result = await checkAttendingAmount(event.id, event.maxCapacity);
        return { event, result };
      })
    );
    return results.filter(({ result }) => result).map(({ event }) => event);
  }

  useEffect(() => {
    const start = async () => {
      await getSession(setSession);
      await getAllEvents(setEvents);
      await getUserId(setUserId);
      await checkFavouriteEvents(setFavourites);
      await checkEventAttendees(setEventAttendees, userId);
      setFilteredEvents(events);
      filterOutEvents(events, setFilteredEvents, true);
      setHiddenLoading(false);
      setResetFilters(false);
    };
    start();
    const eventChannel = supabaseClient
      .channel("eventChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventFavourites" },
        (_payload) => {
          checkFavouriteEvents(setFavourites);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventAttendees" },
        (_payload) => {
          checkEventAttendees(setEventAttendees, userId);
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
  }, [hiddenLoading, resetFilters]);

  async function favouriteEvent(eventId) {
    if (userId) {
      if (favourites.filter((event) => event.eventId === eventId).length) {
        const { data } = await supabaseClient
          .from("eventFavourites")
          .delete()
          .eq("userId", userId)
          .eq("eventId", eventId);
      } else {
        const { data } = await supabaseClient
          .from("eventFavourites")
          .insert({ userId: userId, eventId: eventId });
      }
    } else {
      setCheckAction(true);
    }
  }

  async function joinEvent(event) {
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

  async function addToCalendar(event) {
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

  function cancelLogIn() {
    setCheckAction(false);
  }

  function goToLogIn() {
    setCheckAction(false);
    navigate("/loginPage");
  }

  function showFilterBox() {
    if (!hiddenLoading) {
      setFilterBox(!filterBox);
    }
  }

  async function filterEvents() {
    const newFilter = events.filter((event) => {
      let willReturn = true;
      for (const key in event) {
        if (key === "name") {
          if (
            !!chosenFilters.name &&
            !event[key].includes(chosenFilters.name)
          ) {
            willReturn = false;
          }
        }
        if (key === "categoryType") {
          if (
            (!!chosenFilters.categoryType.gameType &&
              event[key].gameType !== chosenFilters.categoryType.gameType) ||
            (!!chosenFilters.categoryType.platform &&
              event[key].platform !== chosenFilters.categoryType.platform) ||
            (!!chosenFilters.categoryType.eventStyle &&
              event[key].eventStyle !==
                chosenFilters.categoryType.eventStyle) ||
            (!!chosenFilters.categoryType.playerType &&
              event[key].playerType !== chosenFilters.categoryType.playerType)
          ) {
            willReturn = false;
          }
        }
        if (key === "date") {
          const startDateFilter = new Date(chosenFilters.date);
          const eventDate = new Date(event[key]);
          if (chosenFilters.endDate) {
            const endDateFilter = new Date(chosenFilters.endDate).setDate(+1);
            if (startDateFilter >= eventDate || eventDate >= endDateFilter) {
              willReturn = false;
            }
          } else {
            if (startDateFilter >= eventDate) {
              willReturn = false;
            }
          }
        }
        if (
          key === "price" &&
          !!chosenFilters.price &&
          event[key] > chosenFilters.price
        ) {
          willReturn = false;
        }
      }

      return willReturn;
    });
    filterOutEvents(newFilter, setFilteredEvents, false);
  }
  function chooseFilters(key, value) {
    setChosenFilters((prevChosenFilters) => ({
      ...prevChosenFilters,
      [key]: value,
    }));
  }

  function clearFilters() {
    setChosenFilters({
      name: "",
      date: new Date(),
      endDate: "",
      price: "",
      categoryType: {
        gameType: "",
        platform: "",
        eventStyle: "",
        playerType: "",
      },
    });
    setHiddenLoading(true);
    setResetFilters(true);
  }

  function goToEventPage(event) {
    navigate("/eventPage", { state: { event, edit: false } });
  }
  return (
    <>
      <div className="text-charcoal py-10 min-h-212">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Available Quests</h1>
        </div>
        <div className="sm:w-3/5 sm:mx-auto mx-10">
          <div className="flex justify-end">
            <button
              className="border-1 border-border px-2 rounded-4xl bg-linear-to-r from-blue-300 to-purple-300 py-1 hover:cursor-pointer hover:shadow-md"
              onClick={showFilterBox}
            >
              filter
            </button>
          </div>
          <div className={`${filterBox ? "block" : "hidden"}`}>
            <input
              placeholder="event name"
              value={chosenFilters.name}
              onChange={(e) => {
                chooseFilters("name", e.target.value);
              }}
            ></input>

            <div className="">
              <label htmlFor="gameType">Game Type: </label>
              <select
                name="gameType"
                className="bg-mutedwhite w-full mt-1"
                defaultValue=""
                onChange={(e) => {
                  handleSelect(e, "gameType", chosenFilters, chooseFilters);
                }}
              >
                <option value="">Any</option>
                <option value="FPS">FPS</option>
                <option value="MOBA">MOBA</option>
                <option value="RPG">RPG</option>
                <option value="MMORPG">MMORPG</option>
                <option value="Battle Royale">Battle Royale</option>
                <option value="Fighting Games">Fighting Games</option>
                <option value="Racing Games">Racing Games</option>
                <option value="Sports Games">Sport Games</option>
                <option value="Strategy">Strategy</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Indie Games">Indie Games</option>
              </select>
            </div>
            <div className="">
              <label htmlFor="platform">Platform: </label>
              <select
                name="platform"
                className="bg-mutedwhite w-full mt-1"
                defaultValue=""
                onChange={(e) => {
                  handleSelect(e, "platform", chosenFilters, chooseFilters);
                }}
              >
                <option value="">Any</option>
                <option value="PC">PC</option>
                <option value="Console">Console</option>
                <option value="Mobile">Mobile</option>
                <option value="Cross Platform">Cross Platform</option>
              </select>
            </div>
            <div className="">
              <label htmlFor="eventStyle">Event Style: </label>
              <select
                name="eventStyle"
                className="bg-mutedwhite w-full mt-1"
                defaultValue=""
                onChange={(e) => {
                  handleSelect(e, "eventStyle", chosenFilters, chooseFilters);
                }}
              >
                <option value="">Any</option>
                <option value="Tournament">Tournament</option>
                <option value="Casual">Casual</option>
                <option value="Live Stream">Live Stream</option>
                <option value="LAN Party">LAN Party</option>
                <option value="Charity">Charity</option>
                <option value="Game Launch">Game Launch</option>
                <option value="Community Game Night">
                  Community Game Night
                </option>
              </select>
            </div>
            <div className="">
              <label htmlFor="playerType">Type of Player: </label>
              <select
                name="playerType"
                className="bg-mutedwhite w-full mt-1"
                defaultValue=""
                onChange={(e) => {
                  handleSelect(e, "playerType", chosenFilters, chooseFilters);
                }}
              >
                <option value="">Any</option>
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
                <option value="Beginners">Beginners</option>
                <option value="Competitive">Competitive</option>
                <option value="All Skill Levels">All Skill Levels</option>
              </select>
            </div>
            <DateTimePicker
              onChange={(e) => {
                chooseFilters("date", e);
              }}
              id="date"
              value={chosenFilters.date}
              calendarClassName="custom-calendar"
              disableClock={true}
              clearIcon={null}
              format="MM-dd-y"
              required
              dayPlaceholder="dd"
              monthPlaceholder="mm"
              yearPlaceholder="yyyy"
              className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
            />
            <DateTimePicker
              onChange={(e) => {
                chooseFilters("endDate", e);
              }}
              id="date"
              value={chosenFilters.endDate}
              calendarClassName="custom-calendar"
              disableClock={true}
              clearIcon={null}
              minDate={chosenFilters.date ? chosenFilters.date : new Date()}
              format="MM-dd-y"
              required
              dayPlaceholder="dd"
              monthPlaceholder="mm"
              yearPlaceholder="yyyy"
              className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
            />
            <input
              type="number"
              className="w-full p-1 bg-mutedwhite"
              placeholder="Max Price"
              value={chosenFilters.price}
              onChange={(e) => {
                chooseFilters("price", e.target.value);
              }}
            ></input>
            <button
              onClick={filterEvents}
              className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-1/2 py-2 hover:cursor-pointer  hover:shadow-md"
            >
              Apply Filter
            </button>
            <button
              onClick={clearFilters}
              className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-1/2 py-2 hover:cursor-pointer  hover:shadow-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div
          className={`flex justify-center ${
            hiddenLoading ? "animate-fade-in-scale" : "animate-fade-out-scale"
          }`}
        >
          <Lottie animationData={Loading} className="w-150 h-150 mb-100" />
        </div>
        <div
          className={`flex justify-center flex-wrap ${
            hiddenLoading
              ? `hidden`
              : showFadeIn
              ? "animate-fade-in-scale"
              : "invisible"
          }`}
        >
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="mx-10 rounded-2xl shadow-sm shadow-dark-mild rounded-2xl w-100 bg-beige relative z-0 lg:my-10 my-5 hover:bg-mediumbeige transition-transform duration-300 ease-in-out hover:translate-y-1"
            >
              {favourites.filter((favEvent) => favEvent.eventId === event.id)
                .length ? (
                <img
                  src="HeartFilled.png"
                  className="absolute top-0 right-0 hover:cursor-pointer bg-white hover:bg-beige rounded-full"
                  onClick={() => {
                    favouriteEvent(event.id);
                  }}
                />
              ) : (
                <img
                  src="HeartOutline.png"
                  className="absolute top-0 right-0 hover:cursor-pointer bg-white hover:bg-beige rounded-full"
                  onClick={() => {
                    favouriteEvent(event.id);
                  }}
                />
              )}
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  goToEventPage(event);
                }}
              >
                <EventCard event={event} />
              </div>
              <div className="flex justify-end">
                {(!eventAttendees.filter(
                  (attending) => {return attending.eventId === event.id&&attending.userId===userId}
                ).length) && (
                  <button
                    className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer hover:shadow-md"
                    onClick={() => {
                      joinEvent(event);
                    }}
                  >
                    Join Event
                  </button>
                )}
                <Dialog
                  open={checkAddToCalendar !== null}
                  onClose={() => setCheckAddToCalendar(null)}
                  className="relative z-50"
                >
                  <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
                    <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
                      <DialogTitle className="font-bold">
                        Add to Calendar
                      </DialogTitle>
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
                          onClick={() => {
                            addToCalendar(checkAddToCalendar);
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </Dialog>
              </div>
            </div>
          ))}
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
          open={full}
          onClose={() => {
            setFull(false);
            setHiddenLoading(true);
            setResetFilters(true);
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
                  setResetFilters(true);
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
};

export default AllEventsPage;
