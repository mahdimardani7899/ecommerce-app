import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { changeProfile, exitUser } from '../redux/action';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ChangeProfile() {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const [status, setStatus] = useState(false);

  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    firstname: { value: '', validate: false, start: false },
    lastname: { value: '', validate: false, start: false },
    gender: { value: '', validate: false, start: false },
    age: { value: '', validate: false, start: false },
    city: { value: '', validate: false, start: false },
  });
  const { firstname, lastname, gender, age, city } = inputs;
  const navigate = useNavigate();

  const genderOptions = ['male', 'female'];
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

  const checkValidate = () => {
    if (
      !firstname.validate ||
      !lastname.validate ||
      !gender.validate ||
      !age.validate ||
      !city.validate
    ) {
      setInputs((last) => {
        let help = { ...last };

        if (!firstname.validate) {
          help.firstname = { ...help.firstname, start: true };
        }
        if (!lastname.validate) {
          help.lastname = { ...help.lastname, start: true };
        }
        if (!gender.validate) {
          help.gender = { ...help.gender, start: true };
        }
        if (!age.validate) {
          help.age = { ...help.age, start: true };
        }
        if (!city.validate) {
          help.city = { ...help.city, start: true };
        }
        return { ...help };
      });
      return false;
    }
    return true;
  };

  const inputValidate = (field, value) => {
    setInputs((last) => ({
      ...last,
      [field]: {
        start: true,
        value: value,
        validate:
          field === 'age'
            ? !isNaN(value) && parseInt(value, 10) >= 15
            : value.trim() !== '',
      },
    }));
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('user'))?.user?.token) {
      localStorage.removeItem('user');
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = 'Change Profile';
    setInputs({
      firstname: { value: user.firstname, validate: true, start: false },
      lastname: { value: user.lastname, validate: true, start: false },
      gender: { value: user.gender, validate: true, start: false },
      age: { value: user.age, validate: true, start: false },
      city: { value: user.city, validate: true, start: false },
    });
  }, [user, localStorage.getItem('user')]);

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
        title: 'Profile updated successfully',
      });
      setTimeout(() => {
        window.location.reload();
      }, 700);
      
    }
  }, [error, user]);

  const updateUser = () => {
    if (checkValidate()) {
      dispatch(
        changeProfile(
          firstname.value,
          lastname.value,
          gender.value,
          age.value,
          city.value
        )
      );
      setStatus(true);
      setTimeout(() => {
        navigate('/profile');
      }, 700);
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
                updateUser();
              }}
            >
              {/* Firstname */}
              <div className="mb-3">
                <input
                  autoFocus
                  type="text"
                  className={
                    !firstname.validate && firstname.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="First Name ..."
                  value={firstname.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    inputValidate('firstname', value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    inputValidate('firstname', value);
                  }}
                />
                {!firstname.validate && firstname.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    First name is required
                  </p>
                )}
              </div>
              {/* Lastname */}
              <div className="mb-3">
                <input
                  type="text"
                  className={
                    !lastname.validate && lastname.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="Last Name ..."
                  value={lastname.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    inputValidate('lastname', value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    inputValidate('lastname', value);
                  }}
                />
                {!lastname.validate && lastname.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    Last name is required
                  </p>
                )}
              </div>
              {/* Gender */}
              <div className="mb-3">
                <select
                  className={
                    !gender.validate && gender.start
                      ? 'input border-red-500'
                      : 'input'
                  }
                  value={gender.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    inputValidate('gender', value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    inputValidate('gender', value);
                  }}
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {!gender.validate && gender.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    Gender is required
                  </p>
                )}
              </div>
              {/* Age */}
              <div className="mb-3">
                <input
                  type="number"
                  className={
                    !age.validate && age.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="Age ..."
                  value={age.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    inputValidate('age', value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    inputValidate('age', value);
                  }}
                />
                {!age.validate && age.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    Age is required and must be over 15
                  </p>
                )}
              </div>
              {/* City */}
              <div className="mb-3">
                <input
                  type="text"
                  className={
                    !city.validate && city.start
                      ? 'input placeholder:text-sm border-red-500 placeholder:text-red-500 '
                      : 'input placeholder:text-sm'
                  }
                  placeholder="City ..."
                  value={city.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    inputValidate('city', value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    inputValidate('city', value);
                  }}
                />
                {!city.validate && city.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    City is required
                  </p>
                )}
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn btn-primary text-white font-bold"
                  disabled={loading} // Disable the button if loading is true
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }
}

export default ChangeProfile;
