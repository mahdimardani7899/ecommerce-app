import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { exitUser, signup } from "../redux/action";
import Swal from "sweetalert2";

function Signup() {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: { value: "", validate: false, start: false },
    email: { value: "", validate: false, start: false },
    password: { value: "", validate: false, start: false },
    repeatPass: { value: "", validate: false, start: false },
    mobile: { value: "", validate: false, start: false },
  });
  const { username, email, password, repeatPass, mobile } = { ...inputs };
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const checkValidate = () => {
    if (
      !username.validate ||
      !email.validate ||
      !password.validate ||
      !repeatPass.validate ||
      !mobile.validate
    ) {
      setInputs((last) => {
        let help = { ...last };
        if (!password.validate) {
          help.password = { ...help.password, start: true };
        }
        if (!username.validate) {
          help.username = { ...help.username, start: true };
        }
        if (!email.validate) {
          help.email = { ...help.email, start: true };
        }
        if (!repeatPass.validate || repeatPass.value.trim().length == 0) {
          help.repeatPass = { ...help.repeatPass, start: true };
        }
        if (!mobile.validate) {
          help.mobile = { ...help.mobile, start: true };
        }
        return { ...help };
      });
      return false;
    }
    return true;
  };
  useEffect(() => {
    if(Object.keys(user).length){
      navigate('/');
    }
    if(!JSON.parse(localStorage.getItem('user'))?.user?.token){
      localStorage.removeItem("user");
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = "signup";
  }, [localStorage.getItem('user')]);
  useEffect(() => {
    if (status && error.length) {
      Toast.fire({
        icon: "error",
        title: error,
      });
    }
    if (status && Object.keys(user).length) {
      Toast.fire({
        icon: "success",
        title: `${username.value} created successfully`,
      });
      navigate("/");
    }
  }, [error, user]);

  const newUser = () => {
    if (checkValidate()) {
      dispatch(signup(username.value, email.value, password.value, mobile.value));
      setStatus(true);
      dispatch(exitUser());
      localStorage.removeItem("user");
    }
  };

  const usernameValidate = (value) => {
    setInputs((last) => {
      return value.trim().length
        ? {
          ...last,
          username: { start: true, value: value, validate: true },
        }
        : {
          ...last,
          username: {
            start: true,
            value: value,
            validate: false,
          },
        };
    });
  };
  const emailValidate = (value) => {
    setInputs((last) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? {
          ...last,
          email: {
            start: true,
            value: value,
            validate: true,
          },
        }
        : {
          ...last,
          email: {
            start: true,
            value: value,
            validate: false,
          },
        };
    });
  };
  const passwordValidate = (value) => {
    setInputs((last) => {
      if (
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
          value
        )
      ) {
        return repeatPass.value === value
          ? {
            ...last,
            password: {
              start: true,
              value: value,
              validate: true,
            },
            repeatPass: {
              ...repeatPass,
              start: true,
              validate: true,
            },
          }
          : {
            ...last,
            password: {
              start: true,
              value: value,
              validate: true,
            },
            repeatPass: {
              ...repeatPass,
              start: true,
              validate: false,
            },
          };
      } else {
        return {
          ...last,
          password: {
            start: true,
            value: value,
            validate: false,
          },
        };
      }
    });
  };
  const repeatPasswordValidate = (value) => {
    setInputs((last) => {
      return value === password.value
        ? {
          ...last,
          repeatPass: {
            start: true,
            value: value,
            validate: true,
          },
        }
        : {
          ...last,
          repeatPass: {
            start: true,
            value: value,
            validate: false,
          },
        };
    });
  };

  const mobileValidate = (value) => {
    setInputs((last) => {
      return /^(\+98|0)?9\d{9}$/.test(value)
        ? {
          ...last,
          mobile: {
            start: true,
            value: value,
            validate: true,
          },
        }
        : {
          ...last,
          mobile: {
            start: true,
            value: value,
            validate: false,
          },
        };
    });
  };
  switch (true) {
    case Boolean(Object.keys(user).length):
      Toast.fire({
        icon: "success",
        title: `you had already loged in, please first logout`,
      });
      navigate('/');
      break
    default:
      return (
        <div className="my-6 grid justify-center">
          <div className="w-100 sm:w-96 border rounded-xl shadow-lg overflow-hidden">
            <div className="flex gap-5 border text-lg px-4 py-3">
              <div
                className={
                  pathname === "/login"
                    ? "text-red-600 border-b-2  pb-1.5 border-red-600 font-extrabold"
                    : ""
                }
              >
                <Link to="/login">Login</Link>
              </div>
              <div
                className={
                  pathname === "/signup"
                    ? "text-red-600 border-b-2  pb-1.5 border-red-600 font-extrabold"
                    : ""
                }
              >
                <Link to="/signup">Sign up</Link>
              </div>
            </div>
            <hr />
            <form
              className="p-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                newUser();
              }}
            >
              {/* name */}
              <div className="mb-3">
                <input
                  autoFocus
                  type="text"
                  className={
                    !username.validate && username.start
                      ? "input placeholder:text-sm border-red-500 placeholder:text-red-500"
                      : "input placeholder:text-sm "
                  }
                  placeholder="username ..."
                  value={username.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    usernameValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    usernameValidate(value);
                  }}
                />
                {username.start && !username.validate && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    The username field must be filled
                  </p>
                )}
              </div>
              {/* email */}
              <div className="mb-3">
                <input
                  type="text"
                  className={
                    !email.validate && email.start
                      ? "input placeholder:text-sm border-red-500 placeholder:text-red-500 "
                      : "input placeholder:text-sm"
                  }
                  placeholder="Email ..."
                  value={email.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    emailValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    emailValidate(value);
                  }}
                />
                {!email.validate && email.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    The email field is invalid
                  </p>
                )}
              </div>

              {/* password */}
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    !password.validate && password.start
                      ? "input placeholder:text-sm border-red-500 placeholder:text-red-500 "
                      : "input placeholder:text-sm"
                  }
                  placeholder="Password ..."
                  value={password.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    passwordValidate(value)

                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    passwordValidate(value)

                  }}
                />
                {!password.validate && password.start && (
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
                      ? "input placeholder:text-sm border-red-500 placeholder:text-red-500 "
                      : "input placeholder:text-sm"
                  }
                  placeholder="Repeat Password ..."
                  value={inputs.repeatPass[0]}
                  onChange={(e) => {
                    let value = e.target.value;
                    repeatPasswordValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    repeatPasswordValidate(value);

                  }}
                />
                {!repeatPass.validate && repeatPass.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    It must be the same as the password field
                  </p>
                )}
              </div>

              {/* mobile */}
              <div className="mb-3">
                <input
                  type="tel"
                  className={
                    !mobile.validate && mobile.start
                      ? "input placeholder:text-sm border-red-500 placeholder:text-red-500 "
                      : "input placeholder:text-sm"
                  }
                  placeholder="mobile number ..."
                  value={mobile.value}
                  onChange={(e) => {
                    let value = e.target.value;
                    mobileValidate(value);
                  }}
                  onBlur={(e) => {
                    let value = e.target.value;
                    mobileValidate(value);
                  }}
                />
                {!mobile.validate && mobile.start && (
                  <p className="text-xs px-3 pt-1 text-red-500">
                    The mobile field is invalid
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn flex gap-2 items-center"
                  disabled={loading}
                  onClick={newUser}
                >
                  <FaSpinner
                    className={loading ? "block animate-spin" : "hidden"}
                  />
                  Sign up
                  
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }
}

export default Signup;
