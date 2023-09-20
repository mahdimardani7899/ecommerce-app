import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { exitUser } from '../redux/action';

function NotFound() {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    if(!JSON.parse(localStorage.getItem('user'))?.user?.token){
      localStorage.removeItem("user");
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = `Not Found `;
  }, [localStorage.getItem('user')])
  return (
    <p className="h-96 flex justify-center items-center font-bold text-xl text-red-700">
      Page Not Found
    </p>
  )
}

export default NotFound