import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabaseClient from "../config/supabaseClient";
const CheckUserExists = () => {
  const [profileExists, setProfileExists] = useState(false);
  const [hiddenLoading, setHiddenLoading] = useState(true);
  useEffect(() => {
    const checkExists = async () => {
      setHiddenLoading(true);
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (user) {
        const { data } = await supabaseClient
          .from("userProfiles")
          .select("*,users!inner(*)")
          .eq("users.id", user.id);
        if (data && data.length) {
          setProfileExists(true);
          setHiddenLoading(false);
        } else {
          setProfileExists(false);
          setHiddenLoading(false);
        }
      }
    };
    checkExists();
  }, []);

  if (!hiddenLoading) {
    if (profileExists) {
      return <Navigate to="/dashboardPage" />;
    } else {
      return <Navigate to="/createProfilePage" />;
    }
  }
};

export default CheckUserExists;
