import { useContext, useEffect, useState } from 'react';
import './myProfile.css';
import avatar_icon from "../../assets/avatar.png";
import { PencilSquare } from 'react-bootstrap-icons'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const MyProfile = () => {
  const {userData, setUserData, updateAvatar, url, token} = useContext(AppContext);
  console.log(userData);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);

  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);

  const handleImageChange = async (e) => {
    const newFile = URL.createObjectURL(e.target.files[0])
    setFile(newFile);
    updateAvatar(newFile);

    const formData = new FormData();
    formData.append('image', newFile);

    try {
      const response = await axios.post(url + `user/${userData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if(response.data.code == 200) {
        const updatedImageUrl = response.data.image_profile_url;
        setUserData((prev) => ({...prev, image_profile_url: updatedImageUrl}))
      }
    } catch (error) {
      toast.error('Error while uploading image', error);
    }
  }

  const fetchFollowCount = async () => {
    const response = await axios.get(url + `user/${userData.id}`);
    console.log(response.data);

    if(response.data) {
      setFollowersCount(response.data.followers.length || 0);
      setFollowingCount(response.data.following.length || 0);
    }

    const res = await axios.get(url + `posts/user/${userData.id}`);
    if(res.data) {
      setBlogsCount(res.data.length || 0);
    }
  }

  useEffect(() => {
    if(userData.id) {
      fetchFollowCount();
    }
  }, [userData, token])

  return (
    <div className='profile-container'>
      <div className='profile-details'>
        <div className='profile-avatar'>
          <div className='user-pic'> <img src={file || userData.image || avatar_icon} alt="User profile picture" /> </div>
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
        <div className='follow-container'>
          <div>
            <p> Blogs </p>
            <span> {blogsCount} </span>
          </div>
          <div>
            <p> Followers </p>
            <span> {followersCount} </span>
          </div>
          <div>
            <p> Following </p>
            <span> {followingCount} </span>
          </div>
        </div>
        <p> Email: {userData.email} </p>
        {/* {
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
        } */}
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