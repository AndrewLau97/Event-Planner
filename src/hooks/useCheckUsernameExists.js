import { useEffect } from "react";
import supabaseClient from "../config/supabaseClient";

const useCheckUsernameInDatabase = (setAllUsernames) => {
  const checkUsernames = async () => {
    const { data } = await supabaseClient
      .from("userProfiles")
      .select("username");
    const usernameArray = data.map((userProfiles) =>
      userProfiles.username.toLowerCase()
    );
    setAllUsernames(usernameArray);
  };
  useEffect(() => {
    checkUsernames();
  }, []);
};

export default useCheckUsernameInDatabase;
