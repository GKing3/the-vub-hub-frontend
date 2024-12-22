import { useContext, useEffect, useState } from 'react';
import './myProfile.css';
import avatar_icon from "../../assets/avatar.png";
// import { PencilSquare } from 'react-bootstrap-icons'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
axios.defaults.withCredentials = true;


const MyProfile = () => {
  const {userData, setUserData, updateAvatar, url, token} = useContext(AppContext);
  console.log(userData);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);

  const [edit, setEdit] = useState(false); // Manages edit mode
  const [imageUrl, setImageUrl] = useState('');

  // Handles changes made on the user profile image
  const handleImageChange = async (e) => {
    const imageInput = e.target.value;

    // Checks if the string  added in the image input field is a valid URL
    const validUrl = (str) => {
      try {
        new URL(str);
        return true;
      } catch (_) {
        return false;
      }
    }

    if(validUrl(imageInput)) {
      setImageUrl(imageInput); // Updates the state with the new image URL
      updateAvatar(imageInput); // Updates the avatar in the global context

      // const formData = new FormData();
      // formData.append('image', imageInput);

      try {
        const response = await axios.put(url + `user/update-profile-img`, {image_profile_url: imageInput}, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        // console.log(response.data);
        if(response.data.code == 200) {
          const updatedImageUrl = response.data.image_profile_url;
          setUserData((prev) => ({...prev, image_profile_url: updatedImageUrl}))
        }
      } catch (error) {
        toast.error('Error while uploading image', error);
      }
    }
  }

  // Handles changes made in the name input field both locally and server side
  const handleNameChange = async () => {
    // console.log('new name', userData.name);
    const response = await axios.put(url + 'user/update-name', {
      name: userData.name
    });

    if(response.data.code == 200) {
      setUserData(prev => ({...prev, name: userData.name}));
      toast.success('Updated name successfully!');
    } else {
      console.log('Could not update name');
    }
  }

  // Fetches followers and following count from the server and helps render the counts on the 'My Profile' page of a specific logged in user
  const fetchFollowCount = async () => {
    const response = await axios.get(url + `user/${userData.id}`);
    console.log(response.data);

    if(response.data) {
      setFollowersCount(response.data.followers.length || 0);
      setFollowingCount(response.data.following.length || 0);
    }

    // Fetch blogs made by a logged in user
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
    <div className='my-profile-container'>
      <div className='my-profile-details'>
        <div className='my-profile-avatar'>
          {
            edit ? 
            (
              <>
                <div className='user-pic'> <img src={imageUrl || userData.image_profile_url || avatar_icon} alt="User profile picture" /> </div>
                <div>
                  <input onChange={handleImageChange} type="text" name="avatar" id='avatar' placeholder='Enter image url'/>
                  {/* <label htmlFor='avatar'> {<PencilSquare/>} </label> */}
                </div>
              </>
            ) : (
              <> <div className='user-pic'> <img src={imageUrl || userData.image_profile_url || avatar_icon} alt="User profile picture" /> </div> </>
            )
          }
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
        {
          edit 
          ? (
            <>
              <button onClick={() => {
                handleNameChange();
                setEdit(false);
              }} type="submit"> Save </button>
            </>
          ) : ( <button onClick={() => setEdit(true)} type='submit'> Edit Profile </button> )
        }
      </div>
    </div>
  )
}

export default MyProfile