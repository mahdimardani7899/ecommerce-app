import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { changePassword, exitUser, getProfile } from '../redux/action';
import Swal from 'sweetalert2';

function ChangePassword() {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);

  // Create a state variable to store the current password
  const [currentPassword, setCurrentPassword] = useState('');

  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    oldPassword: { value: '', validate: false, start: false },
    newPassword: { value: '', validate: false, start: false },
    repeatPass: { value: '', validate: false, start: false },
  });
  const { oldPassword, newPassword, repeatPass } = inputs;
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

  const resetStatus = () => {
    setStatus(false);
  };

  const checkValidate = () => {
    if (
      !oldPassword.validate ||
      !newPassword.validate ||
      !repeatPass.validate
    ) {
      setInputs((last) => {
        let help = { ...last };

        if (!oldPassword.validate) {
          help.oldPassword = { ...help.oldPassword, start: true };
        }
        if (!newPassword.validate) {
          help.newPassword = { ...help.newPassword, start: true };
        }

        if (!repeatPass.validate) {
          help.repeatPass = { ...help.repeatPass, start: true };
        }
        return { ...help };
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('user'))?.user?.token) {
      localStorage.removeItem('user');
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = 'Change Password';

    // Update the current password when the user object changes
    setCurrentPassword(user?.password || '');
  }, [localStorage.getItem('user'), user, dispatch]);

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
        title: `${user.user.username} Password changed successfully`,
      });
      setStatus(true);
      resetStatus(); // Reset status to false after a successful password change
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [error, user, status, navigate]);

  const changeUser = () => {
    if (checkValidate()) {
      // Check if the oldPassword matches the currentPassword
      if (oldPassword.value === currentPassword) {
        // If they match, proceed with changing the password
        dispatch(changePassword(oldPassword.value, newPassword.value));
        setStatus(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // If oldPassword doesn't match currentPassword, show an error
        Toast.fire({
          icon: 'error',
          title: 'Old password is incorrect',
        });
      }
    }
  };

  const oldPasswordValidate = (value) => {
    setInputs((last) => ({
      ...last,
      oldPassword: {
        start: true,
        value: value,
        validate: true,
      },
    }));
  };

  const newPasswordValidate = (value) => {
    setInputs((last) => {
      const isValid =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(value);
      const isMatching = repeatPass.value === value;

      return {
        ...last,
        newPassword: {
          start: true,
          value: value,
          validate: isValid,
        },
        repeatPass: {
          ...repeatPass,
          start: true,
          validate: isValid && isMatching,
        },
      };
    });
  };

  const repeatNewPasswordValidate = (value) => {
    setInputs((last) => ({
      ...last,
      repeatPass: {
        start: true,
        value: value,
        validate: newPassword.value === value,
      },
    }));
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
              Change Password Page
            </div>
            <form
              className="p-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                changeUser();
              }}
            >
              {/* old password */}
              <div className="mb-3">
                <input
                  autoFocus
                  type="password"
                  className={
                    !oldPassword.validate && oldPassword.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="Old Password ..."
                  value={oldPassword.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    oldPasswordValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    oldPasswordValidate(value);
                  }}
                />
                {!oldPassword.validate && oldPassword.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    The old password field is invalid or wrong
                  </p>
                )}
              </div>
              {/* new password */}
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    !newPassword.validate && newPassword.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="New Password ..."
                  value={newPassword.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    newPasswordValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    newPasswordValidate(value);
                  }}
                />
                {!newPassword.validate && newPassword.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    The password field has Minimum 8 characters, at least one
                    uppercase letter, one lowercase letter, one number and one
                    special character
                  </p>
                )}
              </div>

              {/* repeat password */}
              <div className="mb-4">
                <input
                  type="password"
                  className={
                    !repeatPass.validate && repeatPass.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="Repeat New Password ..."
                  value={repeatPass.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    repeatNewPasswordValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    repeatNewPasswordValidate(value);
                  }}
                />
                {!repeatPass.validate && repeatPass.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    It must be the same as the new password field
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn flex gap-2 items-center"
                  disabled={loading} // Disable the button if loading is true
                >
                  <FaSpinner
                    className={loading ? 'block animate-spin' : 'hidden'}
                  />
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }
}

export default ChangePassword;
