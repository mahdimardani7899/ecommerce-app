import React, { useEffect } from "react";
import { exitUser, getOneOrder } from "../redux/action";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Order() {
  const {
    orders: { loading, orders, error },
    user: { user },
  } = useSelector((last) => last);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
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
    document.title = `Order`;
    if (Object.keys(user).length) {
      dispatch(getOneOrder(id, user?.user?.token));
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
          <p className="font-bold text-lg mb-2">General review:</p>
          <div className="grid grid-cols-5 text-center border bg-slate-200 shadow py-2 mb-2 gap-1  text-xs font-normal md:text-base md:font-bold">
            <div className="">Count Items Order</div>
            <div className="">total Price</div>
            <div>Is Paid</div>
            <div className="">Is Delivered</div>
            <div className="">payment Method</div>
          </div>
          <div className="grid grid-cols-5 text-center border bg-slate-50 shadow py-2 mb-2 hover:cursor-pointer hover:bg-slate-300 transition-all duration-200 gap-1  text-xs font-normal md:text-base md:font-bold">
            <div className="">{orders.orderItems?.length}</div>
            <div className="text-red-500 ">{orders.totalPrice}$</div>
            <div>{orders.isPaid ? "Yes" : "No"}</div>
            <div className="">{orders.isDelivered ? "Yes" : "No"}</div>
            <div className="">{orders.paymentMethod}</div>
          </div>

          <hr className="my-3" />
          <p className="font-bold text-lg mb-2">Detailed review:</p>
          <div className="grid grid-cols-6 text-center border bg-slate-200 shadow  py-2 mb-2  text-xs font-normal md:text-base md:font-bold">
            <div className="text-left px-4">Image</div>
            <div className="col-span-2 ">Name</div>
            <div className=" ">Price</div>
            <div className=" ">Count</div>
            <div className=" ">Total Price</div>
          </div>
          {orders.orderItems?.map((item) => {
            return (
              <div key={item._id}>
                <div className="grid grid-cols-6 text-center border  items-center my-1 bg-slate-50  text-xs font-normal md:text-base md:font-bold">
                  <div className=" ">
                    <img
                      src={item?.product?.image}
                      alt={item?.product?.name}
                      className=" lg:w-3/5"
                    />
                  </div>
                  <div className="col-span-2">{item?.product?.name}</div>
                  <div className="">{item?.product?.price}$</div>
                  <div className="">{item.qty}</div>
                  <div className="">{item?.product?.price * item.qty}$</div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-end">
            <div className="w-2/3  sm:w-2/5 grid grid-cols-2 gap-2 border  text-xs font-normal md:text-base md:font-bold  items-center">
              <div className="text-slate-500 bg-slate-100  font-bold h-full p-2">
                Total Price
              </div>
              <div className="font-bold text-red-600 md:text-lg h-full p-2">
                {orders.totalPrice}$
              </div>
            </div>
          </div>

          <hr className="my-3" />
          <p className="font-bold text-lg mb-2">Address:</p>
          <div className="grid lg:grid-cols-2 gap-1">
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                Address
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {orders.shippingAddress?.address}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                City
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {orders.shippingAddress?.city}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                Postal code
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {orders.shippingAddress?.postalCode}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border shadow-sm">
              <div className="text-slate-500 bg-slate-100 p-2 font-bold">
                Phone
              </div>
              <div className=" col-span-3 text-slate-600  p-2">
                {orders.shippingAddress?.phone}
              </div>
            </div>
          </div>
        </div>
      );
  }
}
export default Order;
