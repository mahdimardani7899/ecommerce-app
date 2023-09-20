import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { changePassword, exitUser, getProfile } from "../redux/action";
import Swal from "sweetalert2";

function Profile() {
  const {
    user: { user, loading, error },
  } = useSelector((state) => state);
  const [status, setStatus] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();
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

  useEffect(() => {
    if(!JSON.parse(localStorage.getItem('user'))?.user?.token){
      localStorage.removeItem("user");
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    dispatch(getProfile());
    document.title = `Profile`;
  }, [localStorage.getItem('user')]);

  switch (true) {
    case Boolean(!Object.keys(user).length):
      Toast.fire({
        icon: "info",
        title: `Please Login`,
      });
      navigate('/login');
      break
    default:
      return (
        <div className="my-6">
          <div>
            <img style={{
              maxWidth: "300px",
              height: "100%",
              objectFit: "contain",
              borderRadius: "2rem",
              border: "2px solid green"
            }}
              src={user?.user?.image} alt={user?.user?.username} />
          </div>
          <div style={{ maxWidth: "30rem", margin: "auto" }} className="grid lg:grid-cols-1 gap-1">
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                email:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.email}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                user name:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.username}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                mobile:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.mobile}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                first name:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.firstname}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                last name:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.lastname}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                gender:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.gender}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                age:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.age}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                city:
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {user?.user?.city}
              </div>
            </div>
          </div>
        </div>
      );
  }
}
export default Profile;

