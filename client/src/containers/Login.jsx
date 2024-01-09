import React, { useEffect, useState } from 'react';
import { loginBg, logo } from '../assets'
import { LoginInput } from '../components';
import { buttonClick } from '../animations';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion';

import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../config/firebase.config';
import { validateUserJWTToken } from '../api';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../context/actions/userActions';
import { alertInfo, alertWarning } from '../context/actions/alertActions';

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider(); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const alert = useSelector(state => state.alert);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then(userCred => {
      firebaseAuth.onAuthStateChanged(cred => {
        if (cred) {
          cred.getIdToken().then(token => {
            validateUserJWTToken(token).then(data => {
              dispatch(setUserDetails(data));
            });
            navigate("/", { replace: true });
          })
        }
      })
    })
  }

  const signUpWithEmailPass = async () => {
    if (!(userEmail && userPassword && confirmPassword)) {
      dispatch(alertInfo("Required fields should not be empty"));
    } else {
      if (userPassword === confirmPassword) {
        setUserEmail("");
        setUserPassword("");
        setConfirmPassword("");
        await createUserWithEmailAndPassword(firebaseAuth, userEmail, userPassword).then(userCred => {
          firebaseAuth.onAuthStateChanged(cred => {
            if (cred) {
              cred.getIdToken().then(token => {
                validateUserJWTToken(token).then(data => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            };
          });
        });
      } else {
        dispatch(alertWarning("Password doesn't match"));
      }
    }
  }

const signInWithEmailPass = async () => {
    if (userEmail !== "" && userPassword !== "") {
      await signInWithEmailPass(firebaseAuth, userEmail, userPassword).then(userCred => {
        firebaseAuth.onAuthStateChanged(cred => {
          if (cred) {
            cred.getIdToken().then(token => {
              validateUserJWTToken(token).then(data => {
                dispatch(setUserDetails(data));
              });
              navigate("/", { replace: true });
            })
          }
        })
      })
    } else {
      dispatch(alertWarning("Password doesn't match"));
    }
  }

  const handeClick = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className='w-screen h-screen relative overflow-hidden flex items-center'>

      {/* Background */}
      <img src={loginBg} className='w-full h-full object-cover absolute top-0 left-0' alt=''/>

      {/* Content-box */}
      <div className='flex flex-col items-center gap-6 w-[80%] md:w-508 h-full z-10 backdrop-blur-md bg-white/30 p-4 px-4 py-12'>
      
        {/* logo section */}
        <div className='flex items-center justify-start gap-4 w-full'>
          <img src={logo} className='w-8' alt='' />
          <p className='text-black/70 font-semibold text-2xl' >City</p>
        </div>

        {/* Welcome Text */}
        <p className='text-3xl text-headingColor font-semibold' >Welcome back</p>
        <p className='text-lg text-textColor font-semibold -mt-7' >{!isSignUp ? "Sign In" : "Sign Up"} with following</p>

        {/* Input Section */}
        <div className='w-full flex flex-col gap-6 items-center justify-center px-4 md:px-12' >
          <LoginInput placeHolder={"Email Here"} icon={<FaEnvelope className='text-xl text-textColor' />} inputState={userEmail} inputStateFunc={setUserEmail} type="email" isSignUp={isSignUp}  />
          
          <LoginInput placeHolder={"Password Here"} icon={<FaLock className='text-xl text-textColor' />} inputState={userPassword} inputStateFunc={setUserPassword} type="password" 
          isSignUp={isSignUp}  />
          
          {(isSignUp && (<LoginInput placeHolder={"Confirm Password Here"} icon={<FaLock className='text-xl text-textColor' />} inputState={confirmPassword} inputStateFunc={setConfirmPassword} type="password" isSignUp={isSignUp}  />))}

          {!isSignUp ? <p>
            Doesn't have an account?{" "}
            <motion.button {...buttonClick} onClick={handeClick} className='text-red-400 underline cursor-pointer bg-transparent'>Create One</motion.button> 
            </p> : <p>
            Already have an account?{" "}
            <motion.button {...buttonClick} onClick={handeClick} className='text-red-400 underline cursor-pointer bg-transparent'>Sign In Here</motion.button> 
            </p>
          }

          {/* Button Section */}
          {!isSignUp ? <motion.button onClick={signInWithEmailPass} className='w-full px-4 py-2 rounded-md bg-red-400 text-white capitalize hover:bg-red-500 transition-all duration-150'>Sign In</motion.button> : 
          <motion.button onClick={signUpWithEmailPass} className='w-full px-4 py-2 rounded-md bg-red-400 text-white capitalize hover:bg-red-500 transition-all duration-150'>Sign Up</motion.button>
          }
        </div>

        {/* Lines */}
        <div className='flex items-center justify-between gap-16'>
          <div className='w-24 h-[1px] rounded-md bg-white'></div>
          <p className='text-white'>OR</p>
          <div className='w-24 h-[1px] rounded-md bg-white'></div>
        </div>

        {/* Sign In with Google */}
        <motion.div {...buttonClick} onClick={loginWithGoogle} className='flex items-center justify-center px-20 py-2 backdrop-blur-md bg-white/30 cursor-pointer rounded-3xl gap-4'>
          <FcGoogle className='text-3xl'/>
          <p className='capitalize text-base text-headingColor'>Sign In With Google</p>
        </motion.div>

      </div>

    </div>
  )
}

export default Login