import axios from 'axios';
import {
  loadingType,
  errorType,
  successType,
  Api,
  loadingUser,
  successUser,
  errorUser,
  loadingOrders,
  successOrders,
  errorOrders,
  loadingCart,
  successCart,
  errorCart,
} from '../constants';

export const getAllProduct = () => async (dispatch, getState) => {
  dispatch({
    type: loadingType,
    payload: { ...getState().products, loading: true },
  });
  try {
    const { data } = await axios(`${Api}/product`);
    dispatch({
      type: successType,
      payload: { data: [...data], loading: false, error: '' },
    });
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;

    dispatch({
      type: errorType,
      payload: { data: [], error: errors.message, loading: false },
    });
  }
};
export const getOneProduct = (id) => async (dispatch, getState) => {
  dispatch({
    type: loadingType,
    payload: { ...getState().products, loading: true },
  });
  try {
    const { data } = await axios(`${Api}/product/${id}`);

    dispatch({
      type: successType,
      payload: { data: [{ ...data }], loading: false, error: '' },
    });
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;

    dispatch({
      type: errorType,
      payload: { data: [], error: errors.message, loading: false },
    });
  }
};
export const signup =
  (username, email, password, mobile) => async (dispatch, getState) => {
    dispatch({
      type: loadingUser,
      payload: { ...getState().user, loading: true },
    });
    try {
      const { data } = await axios.post(`${Api}/user/signup`, {
        username,
        email,
        password,
        mobile,
      });

      dispatch({
        type: successUser,
        payload: {
          error: '',
          loading: false,
          user: { ...data },
        },
      });
    } catch (error) {
      const errors = error.response.data ? error.response.data : error;

      dispatch({
        type: errorUser,
        payload: {
          error: errors.message,
          loading: false,
          user: {},
        },
      });
    }
  };
export const exitUser = () => async (dispatch, getState) => {
  dispatch({
    type: successUser,
    payload: {
      error: '',
      loading: false,
      user: {},
    },
  });
  localStorage.removeItem('user');
  
};
export const login = (email, password) => async (dispatch, getState) => {
  dispatch({
    type: loadingUser,
    payload: { ...getState().user, loading: true },
  });
  try {
    const { data } = await axios.post(`${Api}/user/login`, {
      password,
      email,
    });

    dispatch({
      type: successUser,
      payload: {
        error: '',
        loading: false,
        user: { ...data, password },
      },
    });
    localStorage.setItem('user', JSON.stringify(data));
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;

    dispatch({
      type: errorUser,
      payload: {
        error: errors.message,
        loading: false,
        user: {},
      },
    });
  }
};
export const getProfile = () => async (dispatch, getState) => {
  dispatch({
    type: loadingUser,
    payload: { ...getState().user, loading: true },
  });
  try {
    const { token } = { ...getState()?.user?.user?.user };
    const { data } = await axios.get(`${Api}/user/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: successUser,
      payload: {
        error: '',
        loading: false,
        user: { ...data, token }, // Do not include the password here
      },
    });
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;
    dispatch({
      type: errorUser,
      payload: {
        error: errors.message,
        loading: false,
        user: {},
      },
    });
  }
};
export const submit = (orders, token) => async (dispatch, getState) => {
  dispatch({
    type: loadingOrders,
    payload: { ...getState().orders, loading: true },
  });
  try {
    const { data } = await axios.post(
      `${Api}/order/submit`,
      {
        ...orders,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: successOrders,
      payload: {
        error: '',
        loading: false,
        orders: { ...data },
      },
    });
    // remove cart
    dispatch({
      type: successCart,
      payload: {
        error: '',
        loading: false,
        data: [],
      },
    });
    localStorage.removeItem('cart');
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;

    dispatch({
      type: errorOrders,
      payload: {
        error: errors.message,
        loading: false,
        orders: {},
      },
    });
  }
};
export const getAllOrder = (token) => async (dispatch, getState) => {
  dispatch({
    type: loadingOrders,
    payload: { ...getState().orders, loading: true },
  });
  try {
    const { data } = await axios.get(`${Api}/order`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: successOrders,
      payload: {
        error: '',
        loading: false,
        orders: { ...data },
      },
    });
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;
    dispatch({
      type: errorOrders,
      payload: {
        error: errors.message,
        loading: false,
        orders: {},
      },
    });
  }
};
export const getOneOrder = (id, token) => async (dispatch, getState) => {
  dispatch({
    type: loadingOrders,
    payload: { ...getState().orders, orders: {}, loading: true },
  });
  try {
    const { data } = await axios.get(`${Api}/order/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: successOrders,
      payload: {
        error: '',
        loading: false,
        orders: { ...data },
      },
    });
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;

    dispatch({
      type: errorOrders,
      payload: {
        error: errors.message,
        loading: false,
        orders: {},
      },
    });
  }
};

export const AddTocartLS = (index) => (dispatch, getState) => {
  dispatch({
    type: loadingCart,
    payload: { ...getState().cart, loading: true },
  });
  try {
    const { data } = { ...getState().cart };
    const item = { ...data[index] };
    item.count =
      item.count < data[index].product.countInStock
        ? item.count + 1
        : data[index].product.countInStock;
    data[index] = { ...item };

    dispatch({
      type: successCart,
      payload: {
        error: '',
        loading: false,
        data: [...data],
      },
    });
    localStorage.setItem('cart', JSON.stringify([...data]));
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;
    dispatch({
      type: errorCart,
      payload: {
        error: errors.message,
        loading: false,
        data: {},
      },
    });
  }
};
export const minusTocartLS = (index) => (dispatch, getState) => {
  dispatch({
    type: loadingCart,
    payload: { ...getState().cart, loading: true },
  });
  try {
    const { data } = { ...getState().cart };
    const item = { ...data[index] };
    item.count = item.count > 0 ? item.count - 1 : 0;
    data[index] = { ...item };

    dispatch({
      type: successCart,
      payload: {
        error: '',
        loading: false,
        data: [...data],
      },
    });
    localStorage.setItem('cart', JSON.stringify([...data]));
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;
    dispatch({
      type: errorCart,
      payload: {
        error: errors.message,
        loading: false,
        data: {},
      },
    });
  }
};
export const removeFromcartLS = (index) => (dispatch, getState) => {
  dispatch({
    type: loadingCart,
    payload: { ...getState().cart, loading: true },
  });
  try {
    const { data } = { ...getState().cart };
    data.splice(index, 1);

    dispatch({
      type: successCart,
      payload: {
        error: '',
        loading: false,
        data: [...data],
      },
    });
    data.length
      ? localStorage.setItem('cart', JSON.stringify([...data]))
      : localStorage.removeItem('cart');
  } catch (error) {
    const errors = error.response.data ? error.response.data : error;
    dispatch({
      type: errorCart,
      payload: {
        error: errors.message,
        loading: false,
        data: {},
      },
    });
  }
};
export const addProductTocartLS =
  (productItem, indexCart) => (dispatch, getState) => {
    dispatch({
      type: loadingCart,
      payload: { ...getState().cart, loading: true },
    });
    try {
      const { data } = { ...getState().cart };
      if (indexCart > -1) {
        const item = { ...data[indexCart] };
        item.count =
          item.count < item.product.countInStock
            ? item.count + 1
            : item.product.countInStock;
        data[indexCart] = { ...item };
        dispatch({
          type: successCart,
          payload: {
            error: '',
            loading: false,
            data: [...data],
          },
        });
        localStorage.setItem('cart', JSON.stringify([...data]));
      } else if (indexCart === -1) {
        dispatch({
          type: successCart,
          payload: {
            error: '',
            loading: false,
            data: [...data, { product: { ...productItem }, count: 1 }],
          },
        });
        localStorage.setItem(
          'cart',
          JSON.stringify([...data, { product: { ...productItem }, count: 1 }])
        );
      }
    } catch (error) {
      const errors = error.response.data ? error.response.data : error;
      dispatch({
        type: errorCart,
        payload: {
          error: errors.message,
          loading: false,

          data: {},
        },
      });
    }
  };

export const changePassword = (oldPassword,newPassword) => async (dispatch, getState) => {
  dispatch({
    type: loadingUser,
    payload: { ...getState().user, loading: true },
  });

  try {
    const { token } = { ...getState()?.user?.user?.user };

    // Send the new password in the request body
    const { data } = await axios.put(
      'http://kzico.runflare.run/user/change-password',
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );

    dispatch({
      type: successUser,
      payload: {
        error: '',
        loading: false,
        user: { ...data, token },
      },
    });
  } catch (error) {
    const errors = error.response?.data || error;
    dispatch({
      type: errorUser,
      payload: {
        error: errors.message,
        loading: false,
        user: {},
      },
    });
  }
};

export const changeProfile = (
  firstname,
  lastname,
  gender,
  age,
  city
) => async (dispatch, getState) => {
  dispatch({
    type: loadingUser,
    payload: { ...getState().user, loading: true },
  });

  try {
    const { token } = { ...getState()?.user?.user?.user };

    // Send the updated profile information in the request body
    const { data } = await axios.put(
      'http://kzico.runflare.run/user/change-profile',
      {
        firstname,
        lastname,
        gender,
        age,
        city,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );

    dispatch({
      type: successUser,
      payload: {
        error: '',
        loading: false,
        user: { ...data, token, firstname, lastname, gender, age, city },
      },
    });
  } catch (error) {
    const errors = error.response?.data?.message || error;
    dispatch({
      type: errorUser,
      payload: {
        error: Array.isArray(errors) ? errors.join(', ') : errors,
        loading: false,
        user: {},
      },
    });
  }
};

export const uploadAvatar = (formData) => async (dispatch, getState) => {
  dispatch({
    type: loadingUser,
    payload: { ...getState().user, loading: true },
  });

  try {
    const { token } = { ...getState()?.user?.user?.user };
    const { data } = await axios.post('http://kzico.runflare.run/user/profile-image', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: successUser,
      payload: {
        error: '',
        loading: false,
        user: { ...data },
      },
    });
  } catch (error) {
    const errors = error.response?.data || error;
    dispatch({
      type: errorUser,
      payload: {
        error: errors.message,
        loading: false,
        user: {},
      },
    });
  }
};