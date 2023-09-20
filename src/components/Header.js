import React, { useEffect, useState } from 'react';
import {
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineFileSearch,
  AiOutlineLogout,
  AiOutlineShopping,
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { exitUser, getProfile } from '../redux/action';
import useComponentVisible from './useComponentVisible';

function Header() {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const {
    user: { error, user },
    cart: { data },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countCart, setCountCart] = useState(0);
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

  // Function to check token validity
  const isTokenValid = () => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    return userFromLocalStorage?.user?.token;
  };

  useEffect(() => {
    // Check token validity when the component mounts
    if (!isTokenValid()) {
      // Token is not valid, log out the user
      localStorage.removeItem('user');
      dispatch(exitUser());
      navigate('/');
    }
  }, []);

  useEffect(() => {
    let totalCount = 0;
    data.forEach(({ count }) => {
      totalCount += count;
    });
    setCountCart(totalCount);
  }, [data]);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('user'))?.user?.token) {
      localStorage.removeItem('user');
    }
    console.log(JSON.parse(localStorage.getItem('user'))?.user?.token);
    // validation token
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
  }, [localStorage.getItem('user')]);

  return (
    <header
      className={
        'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg'
      }
    >
      <div className="container-main flex justify-between items-center py-4">
        <div className="cursor-pointer text-4xl font-bold hover:text-blue-400 scale-100 hover:scale-125 ease-in duration-300">
          <Link to="/">Home</Link>
        </div>
        <div>
          <ul className="flex items-center space-x-6">
            <li className="font-semibold">
              {localStorage.getItem('user') ? (
                <div className="relative">
                  <div
                    className={
                      'cursor-pointer btn-user hover:text-blue-400 text-xl text-white'
                    }
                    onClick={() => {
                      setIsComponentVisible(true);
                    }}
                  >
                    <img
                      className="w-8 h-8 object-cover rounded-full border-2 border-green-500 scale-100 hover:scale-150 ease-in duration-300"
                      src={user?.user?.image}
                      alt={user?.user?.username}
                    />
                  </div>

                  {isComponentVisible && (
                    <ul
                      ref={ref}
                      id="someElementID"
                      className={
                        'w-32 absolute top-12 right-0 z-50 bg-white text-black border border-gray-300 shadow-lg rounded-lg'
                      }
                    >
                      <li
                        className={'text-green-600 text-base p-1 rounded-t-lg'}
                      >
                        <div>
                          <img
                            className="w-24 h-24 object-cover rounded-full border-2 border-green-500"
                            src={user?.user?.image}
                            alt={user?.user?.username}
                          />
                        </div>
                      </li>
                      <hr className="border-gray-300" />

                      <li
                        className={
                          'cursor-pointer hover:text-blue-500 hover:bg-gray-200 px-4 py-2 border-b border-gray-300 text-black'
                        }
                        onClick={() => {
                          setIsComponentVisible(false);
                        }}
                      >
                        <Link className="flex gap-2" to="/profile">
                          <AiOutlineUser className="text-2xl text-gray-700" />
                          Profile
                        </Link>
                      </li>
                      <li
                        className={
                          'cursor-pointer hover:text-blue-500 hover:bg-gray-200 px-4 py-2 border-b border-gray-300 text-black'
                        }
                        onClick={() => {
                          setIsComponentVisible(false);
                        }}
                      >
                        <Link className="flex gap-2" to="/settings">
                          <AiOutlineSetting className="text-2xl text-gray-700" />
                          Settings
                        </Link>
                      </li>
                      <li
                        className={
                          'cursor-pointer hover:text-blue-500 hover:bg-gray-200 px-4 py-2 border-b border-gray-300 text-black'
                        }
                        onClick={() => {
                          setIsComponentVisible(false);
                        }}
                      >
                        <Link className="flex gap-2" to="/orders">
                          <AiOutlineFileSearch className="text-2xl text-gray-700" />
                          Orders
                        </Link>
                      </li>
                      <li
                        className={
                          'flex gap-2 cursor-pointer hover:text-blue-500 hover:bg-gray-200 px-4 py-2 rounded-b-lg text-black'
                        }
                        onClick={() => {
                          localStorage.removeItem('user');
                          dispatch(exitUser());
                          Toast.fire({
                            icon: 'success',
                            title: `User logged out`,
                          });
                          setIsComponentVisible(false);
                          navigate('/');
                        }}
                      >
                        <AiOutlineLogout className="text-2xl text-gray-700" />
                        Logout
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={'hover:text-blue-400 text-xl text-white'}
                >
                  Login
                </Link>
              )}
            </li>

            <li
              className={
                'font-semibold cursor-pointer relative text-3xl text-white hover:text-blue-400 scale-100 hover:scale-150 ease-in duration-300'
              }
              onClick={() => {
                navigate('/cart');
              }}
            >
              <AiOutlineShopping />

              <p
                className={
                  'px-2 py-0.5 text-xs rounded-full absolute top-2 left-3 opacity-90 bg-red-400 text-white'
                }
                onClick={() => {
                  navigate('/cart');
                }}
              >
                {countCart}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);
