import { useState } from 'react';
import './myProfile.css';
import { useParams } from 'react-router-dom';
import avatar_icon from "../../assets/avatar.png";
import { PencilSquare } from 'react-bootstrap-icons'


const MyProfile = () => {
  const [userData, setUserData] = useState({
    id: '',
    image: '',
    name: 'John Doe',
    email: '',
    gender: '',
    dob: ''
  })

  const {userId} = useParams();

  const [edit, setEdit] = useState(false);

  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div className='profile-container'>
      <div className='profile-details'>
        <div className='profile-avatar'>
          <div className='user-pic'> <img src={file || avatar_icon} alt="User profile picture" /> </div>
          <input onChange={handleImageChange} type="file" name="avatar" id='avatar' accept='jpeg, png, jpg, webp'/>
          <label htmlFor='avatar'> {<PencilSquare/>} </label>
        </div>
        {
          edit 
          ? (
            <>
              <p className='user-name'> Name: </p>
              <input type='text' value={userData.name} onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}/>
            </>
          ) : ( <p className='user-name'> {userData.name} </p> )
        }
        <p> Email: {userData.email} </p>
        {
          edit
          ? 
            <>
              <p> Gender: </p>
              <select onChange={e => setUserData(prev => ({...prev, gender: e.target.value}))}>
                <option value="Male"> Male </option>
                <option value="Female"> Female </option>
                <option value="Prefer not to say"> Prefer not to say </option>
              </select>
            </>
          : <p> Gender: {userData.gender} </p> 
        }
        {
          edit 
          ? (
            <>
              <p> Date of birth: </p>
              <input type="date" value={userData.dob} onChange={e => setUserData(prev => ({...prev, dob: e.target.value}))}/>
            </>
          ) : ( <p> Date of birth: {userData.dob} </p> )
        }
        {
          edit 
          ? (
            <>
              <button onClick={() => setEdit(false)} type="submit"> Save </button>
            </>
          ) : ( <button onClick={() => setEdit(true)} type='submit'> Edit Profile </button> )
        }
      </div>
    </div>
  )
}

export default MyProfile