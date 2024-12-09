import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { url } from "../Api";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [userData, setUserData] = useState([]);
    const [access, setAccess] = useState('');

    const fetchUserData = async() => {
        try {
            const response = await axios.get(url + 'user/');
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const updateAvatar = (newAvatar) => {
        setUserData((prev) => ({...prev, image: newAvatar}));
    }

    const value = {
        userData,
        setUserData,
        updateAvatar,
        access,
        setAccess,
        url
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}