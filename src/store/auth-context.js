import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const calcRemainingTime = (expTime) => {
  const now = new Date().getTime();
  const expirationTimestamp = new Date(expTime).getTime();

  const remainingDuration = expirationTimestamp - now;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = window.localStorage.getItem("token");
  const storedExpirationDate = window.localStorage.getItem("expiryTime");

  const remainingTime = calcRemainingTime(storedExpirationDate);

  if (remainingTime <= 0) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expiryTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  window.localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  

  const isLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expiryTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expTime) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("expiryTime", expTime);
    const remainingTime = calcRemainingTime(expTime);
    setToken(token);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
