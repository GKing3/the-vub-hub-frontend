import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [userData, setUserData] = useState({
        id: '',
        image: '',
        name: 'John Doe',
        email: '',
        gender: '',
        dob: ''
      })

    const updateAvatar = (newAvatar) => {
        setUserData((prev) => ({...prev, image: newAvatar}));
    }

    const value = {
        userData,
        setUserData,
        updateAvatar
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}