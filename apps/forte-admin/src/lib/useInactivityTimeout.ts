import { useEffect, useState } from "react";

import { cookie } from "./hooks";

// const INACTIVITY_TIMEOUT = 4 * 1000; // 4 seconds
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

const LAST_ACTIVITY_KEY = "lastUserActivity";

export const useInactivityTimeout = () => {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    setPassed(true);
  }, []);

  const checkInactivity = () => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) {
      updateLastActivity();
      return;
    }

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
      const isLoggedIn = !!cookie.get("access_token");
      if (isLoggedIn) {
        cookie.remove("access_token", { path: "/" });
        cookie.remove("refresh_token", { path: "/" });
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        window.location.href = "/";
      }
    }
  };

  const updateLastActivity = () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  };

  useEffect(() => {
    if (passed) {
      // Check inactivity every second
      const intervalId = setInterval(checkInactivity, 1000);

      // Setup activity listeners
      const activities = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
      ];

      activities.forEach((activity) => {
        window.addEventListener(activity, updateLastActivity);
      });

      // Update initial activity
      updateLastActivity();

      // Cleanup
      return () => {
        clearInterval(intervalId);
        activities.forEach((activity) => {
          window.removeEventListener(activity, updateLastActivity);
        });
      };
    } else {
      checkInactivity();
    }
    //eslint-disable-next-line
  }, [passed]);
};
