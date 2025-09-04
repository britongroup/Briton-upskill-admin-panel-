import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token',token);
    delete axios.defaults.headers.common.Authorization;
    console.log(" logout done ");
  }
};

const setUser = (user) => {
  if (user) {
    console.log(" i am session login");
    localStorage.setItem('user', JSON.stringify(user));
    const userlogin =  JSON.parse(localStorage.getItem('user'));
    console.log(" user name is "  +  userlogin.name);
  } else {
    localStorage.removeItem('user',user);
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const user =  JSON.parse(localStorage.getItem('user'));

        // if (token && verifyToken(token)) {
          setSession(token);
          setUser(user);
     

          // const response = await axios.get('/api/account/me');
          // const { user } = response.data;

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
          
        // }
        // else {
        //   dispatch({
        //     type: LOGOUT
        //   });
        // }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  // const login = async (email, password) => {
  //   try {
  //   const response = await axios.post('/api/auth/admin/login', { email, password });
  //   const { token, user } = response.data;

  //   setSession(token);
  //   setUser(user);
  // if(token){
  //   dispatch({
  //     type: LOGIN,
  //     payload: {
  //       isLoggedIn: true,
  //       user
  //     }
    
  //   });
  // }
 
  // if(response.data.status === "failed")
  // {
  //   console.log(response.data.error);
  // }
  
  //   }
  //   catch(error){
  //        console.log(" you are not admin!! get lost..");
  //   }
  // };



  const login = async (email, password) => {
    // Static data for testing
    const staticUser = {
      id: 1,
      name: 'John Doe',
      email: 'admin@gmail.com',
      role: 'admin'
    };
    const staticToken = 'static-jwt-token-12345'; // Replace with any static JWT token
  
    // Simulate token validation (you can always assume token is valid for static purposes)
    setSession(staticToken);
    setUser(staticUser);
  
    // Dispatch the login action to update the state
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: staticUser
      }
    });
  
    console.log('Login successful with static data');
  };
  
  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name:` ${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = async () => {
    try{
    console.log(" i am log out now");
    setSession(null);
    setUser(null);
    dispatch({ type: LOGOUT });
    }
    catch{
      console.log(" i am catch error ");
    }
  };

  const resetPassword = async () => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login,logout, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;