import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import sortDateInfo from "../utils/sortDateInfo";
import chooseFile from "../hooks/useChooseFile";
import DateTimePicker from "react-datetime-picker";
import supabaseClient from "../config/supabaseClient";
import uploadImage from "../hooks/useUploadImage";
import { useNavigate } from "react-router-dom";
import handleSelect from "../utils/handleSelect";

const EventEdit = ({ event }) => {
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
  const startDate = new Date(event.date);
  const endDate = new Date(event.endDate);
  const [editInfo, setEditInfo] = useState({
    id:event.id,
    name: event.name,
    date: startDate,
    description: event.description,
    location: event.location,
    maxCapacity: event.maxCapacity,
    price: event.price,
    categoryType: {
      gameType: event.categoryType.gameType,
      platform: event.categoryType.platform,
      eventStyle: event.categoryType.eventStyle,
      playerType: event.categoryType.playerType,
    },
    bannerPicture: event.bannerPicture,
    endDate: endDate,
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate=useNavigate()

  async function completeEdit() {
    const {data} = await supabaseClient.from("events").update(editInfo).eq("id", event.id)
    if(bannerImage){
      await uploadImage(bannerImage,"eventBanner",event.id,editInfo.bannerPicture)
    }
    navigate("/allEventsPage")
  }

  function updateEventInfo(key, value) {
    setEditInfo((prevEventInfo) => ({ ...prevEventInfo, [key]: value }));
  }

  function handlePriceChange(e) {
    updateEventInfo("price", Number(e.target.value));
    if (e.target.value.includes(".")) {
      let [integer, decimal] = e.target.value.split(".");
      if (decimal) {
        decimal = decimal.slice(0, 2);
      }
      updateEventInfo("price", Number(integer + "." + decimal));
    }
  }

  useEffect(() => {
    const start = async () => {
      sortDateInfo(startDate, setStartDetails);
      sortDateInfo(endDate, setEndDetails);
      setHiddenLoading(false);
    };
    start();

    if (!hiddenLoading) {
      const timer = setTimeout(() => {
        setShowFadeIn(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [hiddenLoading]);
  return (
    <>
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
            <div className="relative z-0 w-4/5 mx-auto">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-120 object-cover w-full my-10 rounded-2xl"
                />
              ) : (
                <img
                  src={`https://xgrtcjeypivgpykqszjq.supabase.co/storage/v1/object/public/eventBanner/${event.id}/${event.bannerPicture}`}
                  className="h-120 object-cover w-full my-10 rounded-2xl"
                />
              )}
              <label htmlFor="eventImage" className="absolute top-0 right-0">
                Change Banner
              </label>
              <input
                className="hidden"
                id="eventImage"
                type="file"
                onChange={(e) => {
                  chooseFile(
                    e,
                    setBannerImage,
                    updateEventInfo,
                    "bannerPicture",
                    setPreview
                  );
                }}
              ></input>
            </div>
            <div className="flex w-4/5 mx-auto justify-between">
              <div className="w-9/16">
                <p className="text-lg font-bold font-georgia">
                  {startDetails.date}
                </p>
                <label htmlFor="name"></label>
                <input
                  type="text"
                  className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  value={editInfo.name}
                  onChange={(e)=>{updateEventInfo("name",e.target.value)}}
                ></input>
                <div>
                  <p className="text-3xl mt-5 mb-3 font-bold">
                    Event Essentials
                  </p>
                  <div className="flex items-center">
                    <p className="mb-1 mr-2">Event Duration: </p>
                    <DateTimePicker
                      onChange={(e) => {
                        updateEventInfo("date", e);
                      }}
                      id="date"
                      value={editInfo.date}
                      calendarClassName="custom-calendar"
                      calendarIcon={null}
                      disableCalendar={true}
                      disableClock={true}
                      clearIcon={null}
                      minDate={new Date()}
                      format="MM-dd-y HH:mm"
                      required
                      dayPlaceholder="dd"
                      monthPlaceholder="mm"
                      yearPlaceholder="yyyy"
                      hourPlaceholder="hh"
                      minutePlaceholder="mm"
                      className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                    />
                    <DateTimePicker
                      onChange={(e) => {
                        updateEventInfo("endDate", e);
                      }}
                      id="date"
                      value={editInfo.endDate}
                      calendarClassName="custom-calendar"
                      calendarIcon={null}
                      disableCalendar={true}
                      disableClock={true}
                      clearIcon={null}
                      minDate={editInfo.date}
                      format="MM-dd-y HH:mm"
                      required
                      dayPlaceholder="dd"
                      monthPlaceholder="mm"
                      yearPlaceholder="yyyy"
                      hourPlaceholder="hh"
                      minutePlaceholder="mm"
                      className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1">Location: </label>
                    <input
                      className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                      value={editInfo.location}
                      onChange={(e) => {
                        updateEventInfo("location", e.target.value);
                      }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="capacity" className="mb-1">
                      Available Quest Holders (capacity):
                    </label>
                    <input
                      className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                      id="capacity"
                      value={editInfo.maxCapacity}
                      onChange={(e) => {
                        updateEventInfo("maxCapacity", e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="mb-10">
                    <p>Tags:</p>
                    <div className="">
                      <label htmlFor="gameType">Game Type: </label>
                      <select
                        name="gameType"
                        className="bg-mutedwhite w-full mt-1"
                        value={editInfo.categoryType.gameType}
                        onChange={(e) => {
                          handleSelect(
                            e,
                            "gameType",
                            editInfo,
                            updateEventInfo
                          );
                        }}
                      >
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
                      <label htmlFor="platform">Platform: </label>
                      <select
                        name="platform"
                        className="bg-mutedwhite w-full mt-1"
                        value={editInfo.categoryType.platform}
                        onChange={(e) => {
                          handleSelect(
                            e,
                            "platform",
                            editInfo,
                            updateEventInfo
                          );
                        }}
                      >
                        <option value="PC">PC</option>
                        <option value="Console">Console</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Cross Platform">Cross Platform</option>
                      </select>
                      <label htmlFor="eventStyle">Event Style: </label>
                      <select
                        name="eventStyle"
                        className="bg-mutedwhite w-full mt-1"
                        value={editInfo.categoryType.eventStyle}
                        onChange={(e) => {
                          handleSelect(
                            e,
                            "eventStyle",
                            editInfo,
                            updateEventInfo
                          );
                        }}
                      >
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
                      <label htmlFor="playerType">Type of Player: </label>
                      <select
                        name="playerType"
                        className="bg-mutedwhite w-full mt-1"
                        value={editInfo.categoryType.playerType}
                        onChange={(e) => {
                          handleSelect(
                            e,
                            "playerType",
                            editInfo,
                            updateEventInfo
                          );
                        }}
                      >
                        <option value="Solo">Solo</option>
                        <option value="Team">Team</option>
                        <option value="Beginners">Beginners</option>
                        <option value="Competitive">Competitive</option>
                        <option value="All Skill Levels">
                          All Skill Levels
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-20">
                  <label
                    htmlFor="description"
                    className="text-3xl mb-3 font-bold"
                  >
                    About this Event
                  </label>
                  <br />
                  <textarea
                    id="description"
                    rows="4"
                    className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl mt-1"
                    placeholder="Description Of Event"
                    required
                    value={editInfo.description}
                    onChange={(e) => {
                      updateEventInfo("description", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="w-1/4">
                <div className="justify-end flex h-10">
                  <img src="HeartFilled.png" />
                </div>
                <button className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer" onClick={completeEdit}>
                  Finish Editing Event
                </button>
                <label htmlFor="price">Price: </label>
                <input
                  placeholder="price"
                  className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  type="number"
                  value={editInfo.price}
                  onChange={(e) => {
                    handlePriceChange(e);
                  }}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default EventEdit;
