// src/reducers/authReducer.js
const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  token: token || null,
  user: user || null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
}
