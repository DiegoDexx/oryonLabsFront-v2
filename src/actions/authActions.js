// src/actions/authActions.js
export const loginUser = (user, token) => {
  // Guardar en localStorage
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));

  return {
    type: 'LOGIN_USER',
    payload: { user, token },
  };
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  return {
    type: 'LOGOUT_USER',
  };
};
