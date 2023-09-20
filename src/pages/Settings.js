import React, { useEffect, useState } from 'react';
import ChangeProfile from './ChangeProfile';
import ChangePassword from './ChangePassword';
import UploadAvatar from './UploadAvatar';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { exitUser, getProfile } from '../redux/action';

const Settings = () => {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('ChangeProfile');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  useEffect(() => {
    if(!JSON.parse(localStorage.getItem('user'))?.user?.token){
      localStorage.removeItem("user");
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = `Settings`;
  }, [localStorage.getItem('user')]);

  switch (true) {
    case Boolean(!Object.keys(user).length):
      Toast.fire({
        icon: 'info',
        title: 'Please Login',
      });
      navigate('/login');
      break
    default:
      return (
        <div className="flex flex-col lg:flex-row h-screen">
          <div className="lg:w-1/4 bg-gray-100 p-4 border-r border-gray-300 shadow-lg">
            <ul>
              <li
                className={`cursor-pointer py-2 px-4 ${
                  activeTab === 'ChangeProfile'
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-800'
                } hover:bg-blue-100 transition duration-300`}
                onClick={() => handleTabClick('ChangeProfile')}
              >
                Change Profile
              </li>
              <li
                className={`cursor-pointer py-2 px-4 ${
                  activeTab === 'ChangePassword'
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-800'
                } hover:bg-blue-100 transition duration-300`}
                onClick={() => handleTabClick('ChangePassword')}
              >
                Change Password
              </li>
              <li
                className={`cursor-pointer py-2 px-4 ${
                  activeTab === 'UploadAvatar'
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-800'
                } hover:bg-blue-100 transition duration-300`}
                onClick={() => handleTabClick('UploadAvatar')}
              >
                Upload Avatar
              </li>
            </ul>
          </div>
          <div className="lg:w-3/4 p-4 bg-white shadow-lg overflow-y-auto">
            {activeTab === 'ChangeProfile' && <ChangeProfile />}
            {activeTab === 'ChangePassword' && <ChangePassword />}
            {activeTab === 'UploadAvatar' && <UploadAvatar />}
          </div>
        </div>
      );
  }
};

export default Settings;
