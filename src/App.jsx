import "./App.css";
import Header from "./components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AllEventsPage from "./pages/AllEventsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import supabase from "./config/supabaseClient";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import CreateProfile from "./pages/CreateProfile";
import CheckUserExists from "./components/CheckUserExists";
import EventsManagementPage from "./pages/EventsManagementPage";
import AdminPage from "./pages/AdminPage";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import getSession from "./hooks/useGetSession";
import IndividualEventPage from "./pages/IndividualEventPage";
import PageWrapper from "./components/PageWrapper";

function App() {
  const [session, setSession] = useState(null);
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const start = async () => {
      await getSession(setSession);
      setHiddenLoading(false);
    };
    start();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hiddenLoading]);

  if (hiddenLoading) {
    return <></>;
  } else {
    return (
      <>
        <div>
          <Header session={session} />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Homepage />
                  </PageWrapper>
                }
              />

              <Route
                path="/allEventsPage"
                element={
                  <PageWrapper>
                    <AllEventsPage />
                  </PageWrapper>
                }
              />

              <Route
                path="/eventsManagementPage"
                element={
                  <PageWrapper>
                    <EventsManagementPage />
                  </PageWrapper>
                }
              />

              <Route
                path="/eventPage"
                element={
                  <PageWrapper>
                    <IndividualEventPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/aboutPage"
                element={
                  <PageWrapper>
                    <AboutPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/contactPage"
                element={
                  <PageWrapper>
                    <ContactPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/createProfilePage"
                element={
                  <PageWrapper>
                    <CreateProfile />
                  </PageWrapper>
                }
              />
              <Route
                path="/adminPage"
                element={
                  <PageWrapper>
                    <AdminPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/dashboardPage"
                element={
                  <PageWrapper>
                    <DashboardPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/loginPage"
                element={
                  <PageWrapper>
                    {!session ? (
                    <div
                      id="login"
                      className="border-1 flex justify-center bg-red-100"
                    >
                      <div className="w-1/2">
                        <Auth
                          supabaseClient={supabase}
                          providers={["google"]}
                          appearance={{
                            theme: ThemeSupa,
                            style: {
                              input: {
                                color: "#091540",
                              },
                              label: {
                                color: "#091540",
                                fontWeight: "bold",
                              },
                              button: {
                                backgroundColor: "#734FCF",
                                fontWeight: "bold",
                                color: "white",
                              },
                              anchor: {
                                color: "#091540",
                              },
                            },
                          }}
                          providerScopes={{
                            google:
                              "https://www.googleapis.com/auth/calendar.events",
                          }}
                        />
                      </div>
                    </div>
                    ) : (
                    <CheckUserExists />)}
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </>
    );
  }
}

export default App;
