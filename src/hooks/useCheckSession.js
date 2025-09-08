import supabaseClient from "../config/supabaseClient";
import { useEffect, useState } from "react";

const useCheckSession = () => {
  const [sessionExists, setSessionExists] = useState(null);

  useEffect(() => {
    const getSessionInfo = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setSessionExists(session);
    };
    getSessionInfo();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSessionExists(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return sessionExists;
};

export default useCheckSession;
