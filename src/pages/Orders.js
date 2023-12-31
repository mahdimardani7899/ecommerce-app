import React, { useEffect } from "react";
import { exitUser, getAllOrder } from "../redux/action";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Orders() {
  const { orders:{loading, orders, error},user:{user} } = useSelector((last) => last);

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
    document.title = `Orders`;
    if (Object.keys(user).length) {
      dispatch(getAllOrder(user?.user?.token));
    }
  }, [localStorage.getItem('user')]);

  switch (true) {
    case Boolean(!Object.keys(user).length):
      Toast.fire({
        icon: "info",
        title: `Please Login`,
      });
      navigate('/login');
    case loading:
      return (
        <>
          <Loading />
        </>
      );
    case Boolean(error):
      return (
        <>
          <Error error={error} />
        </>
      );
    case Boolean(!Object.values(orders).length):
      return (
        <div className="flex justify-center items-center h-96">
          <div className="font-bold text-2xl text-red-500">
            The orders list is empty
          </div>
        </div>
      );

    default:
      return (
        <div className="my-6">
          <div className="grid grid-cols-10 text-center border bg-slate-200 shadow  py-2 mb-2 gap-1  text-xs font-normal md:text-base md:font-bold">
            <div>#</div>
            <div className="col-span-2">Count Items Order</div>
            <div className="col-span-2">total Price</div>
            <div>Is Paid</div>
            <div className="col-span-2">Is Delivered</div>
            <div className="col-span-2">payment Method</div>
          </div>
          {Object.values(orders).sort((x,y)=>Date.parse(y.createdAt)-Date.parse(x.createdAt)).map((item, index) => {
            return (
              <div
                className="grid grid-cols-10 text-center border bg-slate-50 shadow py-2 mb-2 hover:cursor-pointer hover:bg-slate-300 transition-all duration-200 gap-1  text-xs font-normal md:text-base md:font-bold"
                key={index}
                onClick={()=>{
                  navigate(`/orders/${item._id}`)
                }}
              >
                <div>{index + 1}</div>
                <div className="col-span-2">{item.orderItems?.length}</div>
                <div className="text-red-500 col-span-2">
                  {item.totalPrice}$
                </div>
                <div>{item.isPaid ? "Yes" : "No"}</div>
                <div className="col-span-2">
                  {item.isDelivered ? "Yes" : "No"}
                </div>
                <div className="col-span-2">
                 
                  {item.paymentMethod}
                </div>
              </div>
            );
          })}
        </div>
      );
  }
}
export default Orders;
