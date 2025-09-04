import { useContext } from 'react';

// // auth provider
import AuthContext from 'contexts/JWTContext';
// import AuthContext from 'contexts/FirebaseContext';
// // import AuthContext from 'contexts/AWSCognitoContext';
// // import AuthContext from 'contexts/Auth0Context';

// // ==============================|| HOOKS - AUTH ||============================== //

const useAuth = () => {
  const context = useContext(AuthContext);
  

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useAuth;













// // useAuth.js
// import { useState, useEffect } from 'react';


// const useAuth = () => {
//   const [user, setUser] = useState(null);

//   const logout = async () => {
//     try {
//       await auth.signOut(); // replace with your logout logic
//     } catch (error) {
//       console.error('Error during logout:', error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     // Add your authentication state listener here
//     const unsubscribe = auth.onAuthStateChanged((authUser) => {
//       setUser(authUser);
//     });

//     // Cleanup the listener on component unmount
//     return () => unsubscribe();
//   }, []);

//   return {
//     user,
//     logout,
//   };
// };

// export default useAuth;
