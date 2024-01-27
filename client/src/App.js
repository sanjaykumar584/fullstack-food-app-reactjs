import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Main, Dashboard } from './containers';

import { app } from './config/firebase.config';
import { getAuth } from 'firebase/auth';
import { getAllCartItems, validateUserJWTToken } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './context/actions/userActions';
import { motion } from 'framer-motion';
import { fadeInOut } from './animations';
import { Alert, CheckoutSuccess, DbHome, MainLoader } from './components';
import { setCartItems } from './context/actions/cartActions';

const App = () => {
  const firebaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  const alert = useSelector(state => state.alert)

  const dispatch = useDispatch();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((cred) => {
      if (cred) {
        cred.getIdToken().then((token) => {
          validateUserJWTToken(token).then((data) => {
            if (data) {
              getAllCartItems(data?.user_id).then(items => {
                console.log(items);
                dispatch(setCartItems(items));
              })
            }
            dispatch(setUserDetails(data));
          });
        });
      }

      // setTimeout to delay setIsLoading(false) after 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    });
  }, [dispatch, firebaseAuth]);

  return (
    <div className='w-full min-h-screen h-auto flex flex-col items-center justify-center'>
      {isLoading && (
        <motion.div
          {...fadeInOut}
          className='fixed z-50 inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center w-full h-full'
        >
          <MainLoader />
        </motion.div>
      )}
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
        <Route path='/checkout-success' element={<CheckoutSuccess />} />
      </Routes>

        {alert?.type && <Alert type={alert?.type} message={alert?.message}/>}

    </div>
  );
};

export default App;
