import { useEffect, useState } from "react";
import getAllUsersInfo from "../hooks/useGetAllUsersInfo";
// import ProfileCard from "../components/ProfileCard";
import PendingOrganiser from "../components/PendingOrganiser";
import DemoteOrganiser from "../components/DemoteOrganiser";
import supabaseClient from "../config/supabaseClient";
import { Facebook } from "react-content-loader";

const AdminPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [organisers, setOrganisers] = useState([]);
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [showFadeIn, setShowFadeIn] = useState(false);

  useEffect(() => {
    const start = async () => {
      await getAllUsersInfo(setPendingUsers, "pending");
      await getAllUsersInfo(setOrganisers, "organiser");
      setHiddenLoading(false);
    };
    start();
    const adminChannel = supabaseClient
      .channel("adminChannel")
      .on(
        "postgres_changes",
        { event: "update", schema: "public", table: "userProfiles" },
        (_payload) => {
          getAllUsersInfo(setPendingUsers, "pending");
          getAllUsersInfo(setOrganisers, "organiser");
        }
      )
      .subscribe();
    if (!hiddenLoading) {
      const timer = setTimeout(() => {
        setShowFadeIn(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        supabaseClient.removeChannel(adminChannel);
      };
    } else {
      return () => {
        supabaseClient.removeChannel(adminChannel);
      };
    }
  }, [hiddenLoading]);

  return (
    <>
      <div
        className="text-charcoal min-h-212"
      >
        <div className="flex justify-center pt-10">
          <h1 className="text-5xl font-bold">Admin Page</h1>
        </div>
        <div className="flex justify-center pt-5">
          <p>
            Welcome to the admin section! Here, you have the ability to manage
            and oversee the community.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 pt-5 pb-5 mx-10">
          <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl">
              Pending Users - Approve or Deny
            </h3>
            <p>
              Check out the members who want to become organisers! You can
              approve them to give them organiser powers, or deny requests if
              it's not the right fit. It's all about keeping our community safe
              and fun.
            </p>
          </div>
          <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl">
              Current Organisers - Demote if Needed
            </h3>
            <p>
              {" "}
              Here you can see our current organisers. If someone needs to step
              back from organiser duties, you can easily demote them to regular
              members. This keeps the team balanced and ensures everyone is in
              the right role.
            </p>
          </div>
        </div>
        <div className="border-1 bg-powderblue m-10 p-5 rounded-xl min-h-52">
          <div className="flex justify-center">
            <h2 className="text-3xl pb-2">Pending Users</h2>
          </div>

          <div
            className={`border-1 flex rounded-2xl mx-5 w-110 ${
              hiddenLoading ? "animate-fade-in-scale" : "animate-fade-out-scale"
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
            {pendingUsers.map((user) => (
              <div key={user.id}>
                <PendingOrganiser user={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="border-1 bg-sagegreen m-10 p-5 rounded-xl min-h-52">
          <div className="flex justify-center">
            <h2 className="text-3xl pb-2">Current Organisers</h2>
          </div>

          <div
            className={`border-1 flex rounded-2xl mx-5 w-110 ${
              hiddenLoading ? "animate-fade-in-scale" : "animate-fade-out-scale"
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
            {organisers.map((user) => (
              <div key={user.id}>
                <DemoteOrganiser user={user} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
