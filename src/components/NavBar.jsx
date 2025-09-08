import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCheckSession from "../hooks/useCheckSession";
import checkRole from "../hooks/useCheckRole";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import checkProfileExists from "../hooks/useCheckProfileExists";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import supabaseClient from "../config/supabaseClient";

const NavBar = () => {
  const navigate = useNavigate();
  const sessionExists = useCheckSession();
  const [profileRole, setProfileRole] = useState("");
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [createProfileMessage, setCreateProfileMessage] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const start = async () => {
      await checkRole(setProfileRole);
      await checkProfileExists(setProfileExists);
      setHiddenLoading(false);
    };
    start();
  }, [profileRole, sessionExists, profileExists]);

  function navigateToPages(e) {
    setShowNavBar(false);
    if (sessionExists && !profileExists) {
      e.preventDefault();
      setCreateProfileMessage(true);
    }
  }

  async function logOut() {
    setShowDashboard(false);
    const { error } = await supabaseClient.auth.signOut();
    navigate("/");
  }

  if (hiddenLoading) {
    return <></>;
  } else {
    return (
      <>
        <nav className="text-charcoal h-9 flex">
          <div className="lg:hidden flex justify-end">
            <button
              onClick={() => setShowNavBar(!showNavBar)}
              className="p-2 mr-5"
              aria-label="Open menu on mobile only"
              onBlur={(e) => {
                if (!e.relatedTarget) {
                  setShowNavBar(false);
                }
              }}
            >
              <Bars3Icon className="w-6 h-6"/>
            </button>
          </div>
          <div className="flex justify-end">
            <ul
              className={`${
                showNavBar ? "absolute z-1 bg-beige pr-5 py-3 pl-3 shadow-md my-9 mx-1" : "hidden"
              } lg:flex flex-col lg:flex-row items-center text-md `}
            >
              <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                <Link
                  onClick={(e) => {
                    navigateToPages(e);
                  }}
                  to="/"
                >
                  Homepage
                </Link>
              </li>
              <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                <Link
                  onClick={(e) => {
                    navigateToPages(e);
                  }}
                  to="/allEventsPage"
                >
                  Quests(Events)
                </Link>
              </li>
              {(profileRole === "organiser" || profileRole === "admin") && (
                <li className="hover:bg-mediumbeige min-h-9 flex flex-col justify-center px-2">
                  <Link
                    onClick={(e) => {
                      navigateToPages(e);
                    }}
                    to="/eventsManagementPage"
                  >
                    Event Management
                  </Link>
                </li>
              )}
              <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                <Link
                  onClick={(e) => {
                    navigateToPages(e);
                  }}
                  to="/aboutPage"
                >
                  About
                </Link>
              </li>
              <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                <Link
                  onClick={(e) => {
                    navigateToPages(e);
                  }}
                  to="/contactPage"
                >
                  Contact
                </Link>
              </li>
              {profileRole === "admin" && (
                <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                  <Link
                    onClick={(e) => {
                      navigateToPages(e);
                    }}
                    to="/adminPage"
                  >
                    Admin
                  </Link>
                </li>
              )}
              {sessionExists ? (
                <li className="hover:bg-mediumbeige h-9 flex flex-col justify-center px-2">
                  {showNavBar ? (
                    <Link
                      onClick={(e) => {
                        navigateToPages(e);
                      }}
                      to="/dashboardPage"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <div>
                      <div>
                        <button
                          onClick={() => {
                            setShowDashboard(!showDashboard);
                          }}
                          className="hover:cursor-pointer"
                          onBlur={(e) => {
                            if (!e.relatedTarget) {
                              setShowDashboard(false);
                            }
                          }}
                        >
                          <p>Profile</p>
                        </button>
                      </div>
                      <div
                        className={`${
                          showDashboard
                            ? "absolute right-0 z-1 bg-mediumbeige pr-5"
                            : "hidden"
                        } py-3 pl-3 shadow-md my-2 mx-1 rounded-2xl`}
                      >
                        <ul>
                          <li>
                            <Link
                              onClick={(e) => {
                                setShowDashboard(false);
                                navigateToPages(e);
                              }}
                              to="/dashboardPage"
                            >
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={logOut}
                              className="hover:cursor-pointer"
                            >
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li className="pr-3">
                  <Link
                    onClick={(e) => {
                      navigateToPages(e);
                    }}
                    to="/loginPage"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
        <Dialog
          open={createProfileMessage}
          onClose={() => setCreateProfileMessage(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
            <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
              <DialogTitle className="font-bold">Create Profile</DialogTitle>
              <Description>
                Please create your profile before continuing
              </Description>
              <div className="flex justify-end gap-4">
                <button
                  className="border-1 py-1 px-2 rounded-2xl bg-silver"
                  onClick={() => {
                    setCreateProfileMessage(false);
                  }}
                >
                  Okay
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    );
  }
};

export default NavBar;
