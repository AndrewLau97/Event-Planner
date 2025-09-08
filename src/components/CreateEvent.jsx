import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { v4 as uuidv4 } from "uuid";
import chooseFile from "../hooks/useChooseFile";
import uploadImage from "../hooks/useUploadImage";
import supabaseClient from "../config/supabaseClient";
import handleSelect from "../utils/handleSelect";

const CreateEvent = () => {
  const [eventInfo, setEventInfo] = useState({
    id: uuidv4(),
    name: "",
    date: "",
    endDate:"",
    description: "",
    categoryType: {
      gameType: "",
      platform: "",
      eventStyle: "",
      playerType: "",
    },
    location: "",
    maxCapacity: "",
    price: "",
    bannerPicture: "",
  });
  const [preview, setPreview] = useState(null);
  const [bannerImage, setBannerImage] = useState({});
  const [formError, setFormError] = useState({
    name: "",
    description: "",
    bannerPicture: "",
    date: "",
    endDate:"",
    location: "",
    maxCapacity: "",
    price: "",
  });
  let canCreateEvent = true;
  // const [canCreateEvent, setCanCreateEvent] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    canCreateEvent = true;
    const checkError = (({
      name,
      description,
      bannerPicture,
      date,
      endDate,
      location,
      maxCapacity,
      price,
    }) => ({
      name,
      description,
      bannerPicture,
      date,
      endDate,
      location,
      maxCapacity,
      price,
    }))(eventInfo);
    for (const error in checkError) {
      if (checkError[error] === "") {
        canCreateEvent = false;
        handleFormError(undefined, error);
      }
    }
    if (canCreateEvent) {
      uploadImage(
        bannerImage,
        "eventBanner",
        eventInfo.id,
        eventInfo.bannerPicture
      );
      try {
        const { data, error } = await supabaseClient
          .from("events")
          .insert(eventInfo)
          .select();
        if (data) {
          setEventInfo({
            id: uuidv4(),
            name: "",
            date: "",
            endDate:"",
            description: "",
            categoryType: {
              gameType: "",
              platform: "",
              eventStyle: "",
              playerType: "",
            },
            location: "",
            maxCapacity: "",
            price: "",
            bannerPicture: "",
          });
        }
      } catch (error) {
        console.log("error");
      }
    }
  }

  function updateEventInfo(key, value) {
    setEventInfo((prevEventInfo) => ({ ...prevEventInfo, [key]: value }));
    setFormError((prevFormError) => ({ ...prevFormError, [key]: "" }));
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

  function onlyAllowDigits(e) {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (/\d/.test(e.key) || allowedKeys.includes(e.key)) {
      return;
    }
    if (
      e.key === "." &&
      !e.target.value.includes(".") &&
      e.target.value !== ""
    ) {
      return;
    }
    e.preventDefault();
  }

  function handleFormError(e, key) {
    if (e) {
      if (e.target.value === "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          [key]: "This field is required",
        }));
      }
    } else {
      setFormError((prevFormError) => ({
        ...prevFormError,
        [key]: "This field is required",
      }));
    }
  }

  return (
    <>
      <div className="flex justify-center text-charcoal mb-10">
        <div className="flex justify-center bg-mediumbeige md:w-2/3 py-10 rounded-3xl shadow-xl">
          <form className="w-full mx-10">
            <div className="shadow-md p-4 rounded-xl bg-beige mb-10">
              <div className="flex justify-center font-bold">
                <h1 className="text-3xl">General Information</h1>
              </div>
              <div>
                <label htmlFor="name">
                  Event Name <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  id="name"
                  className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  placeholder="Name Of Event"
                  required
                  value={eventInfo.name}
                  onChange={(e) => {
                    updateEventInfo("name", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleFormError(e, "name");
                  }}
                ></input>
                <p className="text-red-500 text-sm my-3">{formError.name}</p>
              </div>
              <div>
                <label htmlFor="description">
                  Event Description <span className="text-red-500">*</span>{" "}
                </label>
                <textarea
                  id="description"
                  rows="4"
                  className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  placeholder="Description Of Event"
                  required
                  value={eventInfo.description}
                  onChange={(e) => {
                    updateEventInfo("description", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleFormError(e, "description");
                  }}
                />
                <p className="text-red-500 text-sm my-3">
                  {formError.description}
                </p>
              </div>
              <div>
                <label htmlFor="eventImage">
                  Event Image <span className="text-red-500">*</span>
                </label>
                <input
                  id="eventImage"
                  type="file"
                  required
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
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    width="full"
                    className="rounded-3xl mt-2"
                  />
                )}
                <p className="text-red-500 text-sm my-3">
                  {formError.bannerPicture}
                </p>
              </div>
            </div>
            <div className="shadow-md p-4 rounded-xl bg-beige mb-10">
              <div className="flex justify-center">
                <h1 className="text-3xl font-bold">Category</h1>
              </div>
              <div className="">
                <label htmlFor="gameType">Game Type: </label>
                <select
                  name="gameType"
                  className="bg-mutedwhite w-full mt-1"
                  defaultValue=""
                  onChange={(e) => {
                    handleSelect(e, "gameType", eventInfo, updateEventInfo);
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
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
                    handleSelect(e, "platform", eventInfo, updateEventInfo);
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
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
                    handleSelect(e, "eventStyle", eventInfo, updateEventInfo);
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
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
                    handleSelect(e, "playerType", eventInfo, updateEventInfo);
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Solo">Solo</option>
                  <option value="Team">Team</option>
                  <option value="Beginners">Beginners</option>
                  <option value="Competitive">Competitive</option>
                  <option value="All Skill Levels">All Skill Levels</option>
                </select>
              </div>
            </div>
            <div className="shadow-md p-4 rounded-xl bg-beige mb-10">
              <div className="flex justify-center">
                <h1 className="text-3xl font-bold">Date and Location</h1>
              </div>
              <div>
                <label htmlFor="date">
                  Event Start Date & Time <span className="text-red-500">*</span>{" "}
                </label>
                <div>
                  <DateTimePicker
                    onChange={(e) => {
                      updateEventInfo("date", e);
                    }}
                    id="date"
                    value={eventInfo.date}
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
                    onBlur={(e) => {
                      handleFormError(e, "date");
                    }}
                  />
                  <p className="text-red-500 text-sm my-3">{formError.date}</p>
                </div>
              </div>
              <div>
                <label htmlFor="date">
                  Event End Date & Time <span className="text-red-500">*</span>{" "}
                </label>
                <div>
                  <DateTimePicker
                    onChange={(e) => {
                      updateEventInfo("endDate", e);
                    }}
                    id="date"
                    value={eventInfo.endDate}
                    calendarClassName="custom-calendar"
                    calendarIcon={null}
                    disableCalendar={true}
                    disableClock={true}
                    clearIcon={null}
                    minDate={eventInfo.date}
                    format="MM-dd-y HH:mm"
                    required
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    hourPlaceholder="hh"
                    minutePlaceholder="mm"
                    className="p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                    onBlur={(e) => {
                      handleFormError(e, "endDate");
                    }}
                  />
                  <p className="text-red-500 text-sm my-3">{formError.endDate}</p>
                </div>
              </div>
              <div>
                <label>
                  Event Location <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  placeholder="Location Of Event"
                  required
                  value={eventInfo.location}
                  onChange={(e) => {
                    updateEventInfo("location", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleFormError(e, "location");
                  }}
                ></input>
                <p className="text-red-500 text-sm my-3">
                  {formError.location}
                </p>
              </div>
            </div>
            <div className="shadow-md p-4 rounded-xl bg-beige mb-10">
              <div className="flex justify-center">
                <h1 className="font-bold text-3xl">Attendance and Pricing</h1>
              </div>
              <div>
                <label htmlFor="capacity">
                  Max Capacity <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  id="capacity"
                  className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  placeholder="How Many People Can Attend"
                  type="number"
                  required
                  value={eventInfo.maxCapacity}
                  onChange={(e) => {
                    updateEventInfo("maxCapacity", Number(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    if (/^\D$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    handleFormError(e, "maxCapacity");
                  }}
                ></input>
                <p className="text-red-500 text-sm my-3">
                  {formError.maxCapacity}
                </p>
              </div>
              <div>
                <label htmlFor="price">
                  Price <span className="text-red-500">*</span>{" "}
                </label>
                <input
                  id="price"
                  type="number"
                  className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl mt-1"
                  placeholder="Price Of Entry"
                  required
                  value={eventInfo.price}
                  onChange={(e) => {
                    handlePriceChange(e);
                  }}
                  onKeyDown={(e) => {
                    onlyAllowDigits(e);
                  }}
                  onBlur={(e) => {
                    handleFormError(e, "price");
                  }}
                ></input>
                <p className="text-red-500 text-sm my-3">{formError.price}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-linear-to-r from-blue-300 to-purple-300 px-2 rounded-2xl my-3 mr-3 hover:cursor-pointer hover:shadow-sm hover:shadow-cyan-100"
                onClick={handleSubmit}
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
