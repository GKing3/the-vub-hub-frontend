import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { url } from "../Api";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState("");

  const fetchUserData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(url + "auth/login/status");
      if (data.code == 200) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAvatar = (newAvatar) => {
    setUserData((prev) => ({ ...prev, image: newAvatar }));
  };

  const value = {
    userData,
    setUserData,
    updateAvatar,
    token,
    setToken,
    url,
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  //useEffect(() => {
  //  console.log("Updated userData: ", userData);
  //}, [userData]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
