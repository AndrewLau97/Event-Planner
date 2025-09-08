import { useEffect, useState } from "react";
import useCheckUsernameInDatabase from "../hooks/useCheckUsernameExists";
import supabaseClient from "../config/supabaseClient";
// import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import checkProfileExists from "../hooks/useCheckProfileExists";
import chooseFile from "../hooks/useChooseFile";
import uploadImage from "../hooks/useUploadImage";
const CreateProfile = () => {
  const [formErrorMessage, setformErrorMessage] = useState({
    usernameErrorMessage: "",
    username: "hidden",
    usernameExists: "hidden",
    firstName: "hidden",
    lastName: "hidden",
    role: "hidden",
    formIncomplete: "invisible",
  });
  const [signUpInfo, setSignUpInfo] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    role: "member",
    city: "",
    phoneNumber: "",
    profilePicture: "",
  });
  const [allUsernames, setAllUsernames] = useState([]);
  const [file, setFile] = useState({});
  const [preview, setPreview] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();
  useCheckUsernameInDatabase(setAllUsernames);
  // add in something to cap in the username length, and name lengths
  const getUser = async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (user !== null) {
      setSignUpInfo((prevFormErrorMessage) => ({
        ...prevFormErrorMessage,
        id: user.id,
      }));
    }
  };

  function handleBlurChange(field, value) {
    if (value === "") {
      updateFormErrorMessage([[field, "block"]]);
      if (field === "username") {
        updateFormErrorMessage([
          ["usernameExists", "hidden"],
          ["usernameErrorMessage", "nofill"],
        ]);
      }
    } else {
      updateFormErrorMessage([[field, "hidden"]]);
      if (
        field === "username" &&
        allUsernames.includes(signUpInfo.username.toLowerCase())
      ) {
        updateFormErrorMessage([
          ["usernameExists", "block"],
          ["usernameErrorMessage", "taken"],
        ]);
      } else if (
        field === "username" &&
        !allUsernames.includes(signUpInfo.username.toLowerCase())
      ) {
        updateFormErrorMessage([
          ["usernameExists", "hidden"],
          ["usernameErrorMessage", ""],
        ]);
      }
    }
  }

  async function uploadProfileDetails(e) {
    e.preventDefault();
    if (
      signUpInfo.username === "" ||
      signUpInfo.firstName === "" ||
      signUpInfo.lastName === ""
    ) {
      const infoPairs = Object.keys(signUpInfo);
      updateFormErrorMessage([["formIncomplete", "visible"]]);
      for (let i = 1; i < 4; i++) {
        if (signUpInfo[infoPairs[i]] === "") {
          updateFormErrorMessage([
            [infoPairs[i], "block"],
            ["usernameErrorMessage", "nofill"],
          ]);
        }
      }
    } else {
      updateFormErrorMessage([["formIncomplete", "invisible"]]);
      // uploadImage(file);
      uploadImage(file, "eventMedia", signUpInfo.id, signUpInfo.profilePicture);
      try {
        const { data } = await supabaseClient
          .from("userProfiles")
          .insert(signUpInfo)
          .select();
        if (data) {
          navigate("/dashboardPage");
        }
      } catch (error) {
        console.log("error");
      }
    }
  }
  function updateFormErrorMessage(fieldErrorsArray) {
    const fieldErrorsObject = Object.fromEntries(fieldErrorsArray);
    setformErrorMessage((prevFormErrorMessage) => ({
      ...prevFormErrorMessage,
      ...fieldErrorsObject,
    }));
  }

  function updateSignUpInfo(key, value) {
    setSignUpInfo((prevSignUpInfo) => ({ ...prevSignUpInfo, [key]: value }));
  }

  useEffect(() => {
    getUser();
    checkProfileExists(setProfileExists);
    if (profileExists) {
      navigate("/dashboardPage");
    }
  }, [profileExists]);

  return (
    <>
      {/* set some loading here to check if checkprofileexists has ran or not, if its ran and profile doesnt exist, show code, otherwise show loading */}
      (
      <div
        className="flex justify-center text-charcoal"
      >
        <form className="p-10">
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>First Name</legend>
            <div>
              <input
                className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl"
                id="firstName"
                type="text"
                required
                placeholder="Jane"
                value={signUpInfo.firstName}
                onChange={(e) => {
                  updateSignUpInfo("firstName", e.target.value);
                }}
                onBlur={() => {
                  handleBlurChange("firstName", signUpInfo.firstName);
                }}
              ></input>
            </div>
            <div className={`${formErrorMessage.firstName}`}>
              <p className="text-red-500 text-sm mt-3">
                this field is required
              </p>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>Last Name</legend>
            <div>
              <input
                className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl"
                id="lastName"
                type="text"
                required
                placeholder="Doe"
                value={signUpInfo.lastName}
                onChange={(e) => {
                  updateSignUpInfo("lastName", e.target.value);
                }}
                onBlur={() => {
                  handleBlurChange("lastName", signUpInfo.lastName);
                }}
              ></input>
            </div>
            <div className={`${formErrorMessage.lastName}`}>
              <p className="text-red-500 text-sm mt-3">
                this field is required
              </p>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend className="text-lg font-semibold px-1">Username</legend>
            <div>
              <input
                className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl"
                id="username"
                type="text"
                required
                placeholder="Janedoe"
                value={signUpInfo.username}
                onChange={(e) => {
                  updateSignUpInfo("username", e.target.value);
                }}
                onBlur={() => handleBlurChange("username", signUpInfo.username)}
              ></input>
              <div className="flex justify-between">
                <div
                  className={
                    formErrorMessage.usernameErrorMessage === ""
                      ? "invisible"
                      : formErrorMessage.usernameErrorMessage === "nofill"
                      ? formErrorMessage.username
                      : formErrorMessage.usernameExists
                  }
                >
                  <p
                    className={`text-red-500 text-sm mt-3 ${formErrorMessage.username}`}
                  >
                    This field is required
                  </p>

                  <p
                    className={`text-red-500 text-sm mt-3 ${formErrorMessage.usernameExists}`}
                  >
                    Username taken
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>Role</legend>
            <div>
              <p>Would you like to sign up as a member or organiser</p>
              <div className="flex justify-evenly">
                <div className="w-1/2">
                  <label htmlFor="member">Member</label>
                  <input
                    className="ml-2"
                    id="member"
                    type="radio"
                    name="status"
                    value="member"
                    onChange={(e) => {
                      updateSignUpInfo("role", e.target.value);
                    }}
                    checked={signUpInfo.role === "member"}
                  ></input>
                </div>
                <div className="w-1/2">
                  <label htmlFor="organiser">Organiser</label>
                  <input
                    className="ml-2"
                    id="organiser"
                    type="radio"
                    name="status"
                    value="pending"
                    onChange={(e) => {
                      updateSignUpInfo("role", e.target.value);
                    }}
                    checked={signUpInfo.role === "pending"}
                  ></input>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>City (Optional)</legend>
            <div>
              <input
                id="city"
                type="text"
                placeholder="London"
                value={signUpInfo.city}
                onChange={(e) => {
                  setSignUpInfo((prevSignUpInfo) => ({
                    ...prevSignUpInfo,
                    city: e.target.value,
                  }));
                }}
                className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl"
              ></input>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>Phone Number (Optional)</legend>
            <div className="">
              <input
                id="phoneNumber"
                type="text"
                placeholder="123-456-7890"
                value={signUpInfo.phoneNumber}
                onChange={(e) => {
                  setSignUpInfo((prevSignUpInfo) => ({
                    ...prevSignUpInfo,
                    phoneNumber: e.target.value,
                  }));
                }}
                className="w-full p-1 bg-mutedwhite text-charcoal rounded-xl"
              ></input>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend>Profile Picture (Optional)</legend>
            <input
              type="file"
              onChange={(e) => {
                // chooseFile(e);
                chooseFile(
                  e,
                  setFile,
                  updateSignUpInfo,
                  "profilePicture",
                  setPreview
                );
              }}
            ></input>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width="120"
                className="rounded-full mt-2"
              />
            )}
          </fieldset>
          <div className="flex justify-between">
            <div
              className={`text-red-500 text-sm mt-3 ${formErrorMessage.formIncomplete}`}
            >
              Please fill in all required fields
            </div>
            <button
              onClick={uploadProfileDetails}
              className="hover:cursor-pointer border-1 rounded-xl px-2 my-2"
            >
              create account
            </button>
          </div>
        </form>
      </div>
      )
    </>
  );
};

export default CreateProfile;
