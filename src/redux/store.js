import {
  legacy_createStore as creatStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { products, user, orders, cart } from './reducer';
const cartLS = JSON.parse(localStorage.getItem('cart'))
  ? JSON.parse(localStorage.getItem('cart'))
  : [];
const userLS = JSON.parse(localStorage.getItem('user'))
  ? JSON.parse(localStorage.getItem('user'))
  : [];

const initialsState = {
  cart: {
    data: [...cartLS],
    loading: false,
    error: '',
  },
  user: {
    user: { ...userLS },
    loading: false,
    error: '',
  },
};

const reducers = combineReducers({ products, user, orders, cart });
const middleWare = [thunk];
const store = creatStore(
  reducers,
  initialsState,
  applyMiddleware(...middleWare)
);
export default store;
