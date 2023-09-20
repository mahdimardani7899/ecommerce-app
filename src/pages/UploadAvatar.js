import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exitUser, getProfile, uploadAvatar } from '../redux/action';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

const UploadAvatar = () => {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const [status, setStatus] = useState(false);

  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const { token } = useSelector((state) => state.user.user);
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
    if (!JSON.parse(localStorage.getItem('user'))?.user?.token) {
      localStorage.removeItem('user');
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = `Upload Avatar`;
  }, [localStorage.getItem('user')]);
  useEffect(() => {
    if (status && error.length) {
      Toast.fire({
        icon: 'error',
        title: error,
      });
    }
    if (status && Object.keys(user).length) {
      Toast.fire({
        icon: 'success',
        title: ` Avatar changed successfully`,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  }, [error, user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profile-image', selectedFile);
      dispatch(uploadAvatar(formData, token));
      setStatus(true);
      setTimeout(() => {
        navigate('/profile');
      }, 700);
    } else {
      // Handle case where no file is selected
      alert('Please select a file to upload.');
    }
  };
  switch (true) {
    case Boolean(!Object.keys(user).length):
      Toast.fire({
        icon: 'info',
        title: 'Please Login',
      });

      navigate('/login');
      break;
    default:
      return (
        <div className="my-6 grid justify-center">
          <div className="w-100 sm:w-96 border rounded-xl shadow-lg overflow-hidden">
            <div className="text-center py-3 font-bold text-xl mb-2 border-b bg-slate-200">
              Change Profile Page
            </div>
            <form
              className="p-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input type="file" onChange={handleFileChange} />

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn btn-primary text-white font-bold"
                  onClick={handleUpload}
                  disabled={loading} // Disable the button if loading is true
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    'Upload Avatar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }
};
export default UploadAvatar;
