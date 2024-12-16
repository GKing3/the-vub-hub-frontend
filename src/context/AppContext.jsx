import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { url } from "../Api";
import { jwtDecode } from "jwt-decode";
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [userData, setUserData] = useState(() => JSON.parse(sessionStorage.getItem('userData')) || "");
    const [token, setToken] = useState('');
    const [users, setUsers] = useState([]);

  const fetchUserData = async () => {
    if (!token) return;

        try {
            const {data} = await axios.get(url + 'auth/login/status');
            if(data.code == 200) {
                setUserData(data.user);
                sessionStorage.setItem('userData', JSON.stringify(data.user));
            }
        } catch (error) {
            console.log(error);
        }
      
    }

  const fetchDetails = async () => {
    if (!token) return;

    try {
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.id;

      const { data } = await axios.get(url + `user/${userId}`);
      if (data.id) {
        setUsers({
          id: data.id,
          email: data.email,
          name: data.name,
          image_profile_url: data.image_profile_url,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAvatar = (newAvatar) => {
    setUserData((prev) => ({ ...prev, image: newAvatar }));
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

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
    fetchDetails();
  }, [token]);

    useEffect(() => {
      console.log(userData);
  }, [userData]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
