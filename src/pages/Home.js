import React, { useEffect } from 'react';
import { exitUser, getAllProduct } from '../redux/action';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaStar } from 'react-icons/fa';
import Error from '../components/Error';

function Home() {
  const {
    products: { data, loading, error },
    user: { user },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('user'))?.user?.token) {
      localStorage.removeItem('user');
    }
    if (!localStorage.getItem('user')) {
      dispatch(exitUser());
    }
    document.title = 'home';
    dispatch(getAllProduct());
  }, [localStorage.getItem('user')]);

  switch (true) {
    case Boolean(error.length):
      return <Error error={error} />;
    case loading:
      return <Loading />;
    default:
      return (
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 my-6 gap-8">
          {data.map((item, index) => {
            return (
              <div
                className="itemOnHome border rounded-md overflow-hidden cursor-pointer shadow-md scale-100 hover:scale-110 ease-in duration-300 mt-5"
                onClick={() => {
                  navigate(`/products/${item._id}`);
                }}
                key={item._id}
              >
                <div className="relative">
                  <img
                    style={{
                      width: '90%',
                      height: '300px',
                      objectFit: 'contain',
                      margin: '1rem auto',
                    }}
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="py-2 px-6">
                  <p className="font-bold line-clamp-1">{item.name}</p>
                  <div className="flex items-center gap-1 cursor-pointer ">
                    <span className="text-sm font-bold text-slate-600">
                      {item.rating}
                    </span>
                    <FaStar className="text-yellow-500 text-lg" />
                  </div>
                  <hr className="my-2" />
                  <p>
                    <span className="font-bold">Price :</span>
                    <span className="ml-2 text-red-700 font-bold">
                      {item.price}$
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
  }
}

export default Home;
