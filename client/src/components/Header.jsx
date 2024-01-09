import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png"
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import {motion} from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import { MdShoppingCart, MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../assets/img/avatar.png";

import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { setUserNull } from '../context/actions/userActions';

const Header = () => {
  const user = useSelector(state => state.user);
  const [isMenu, setIsMenu] = useState(false);

  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    firebaseAuth.signOut().then(() => {
      dispatch(setUserNull());
      navigate("/login", {replace: true});
    }).catch((err) => {console.log(err)});
  }

  return (
    <header className='fixed backdrop-blur-sm z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6'>
        <NavLink to={"/"} className="flex items-center justify-center gap-4">
            <img src={logo} className='w-12' alt=''/>
            <p className='font-semibold text-xl'>City</p>
        </NavLink>

        <nav className='flex items-center justify-center gap-8'>
          <ul className='hidden md:flex items-center justify-center gap-12'>
            <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/"}>Home</NavLink>
            <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/menu"}>Menu</NavLink>
            <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/services"}>Services</NavLink>
            <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/aboutUs"}>About Us</NavLink>
          </ul>

          <motion.div {...buttonClick} className='relative cursor-pointer'>
            <MdShoppingCart className='text-2xl text-textColor'/>
            <div className='w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-2'>
              <p className='text-primary text-base font-semibold'>3</p>
            </div>
          </motion.div>

          {user ? <>
            <div onMouseEnter={() => setIsMenu(true)} className='relative cursor-pointer'>
              <div className='w-10 h-10 rounded-full shadow-md cursor-pointor overflow-hidden flex items-center justify-center'>
                <motion.img whileHover={{scale: 1.15}} referrerPolicy="no-referrer" className='w-full h-full object-cover' src={user?.picture ? user?.picture : {avatar}}></motion.img>
              </div>
              
              {isMenu && (
                <motion.div {...slideTop}
                onMouseLeave={() => setIsMenu(false)} className='px-6 py-4 w-40 bg-white/30 backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-2'>
              <Link
                      className=" hover:text-red-500 text-lg text-textColor"
                      to={"/dashboard/home"}
                    >
                      Dashboard
                    </Link>

                  <Link
                    className=" hover:text-red-500 text-lg text-textColor"
                    to={"/profile"}
                  >
                    My Profile
                  </Link>
                  <Link
                    className=" hover:text-red-500 text-lg text-textColor"
                    to={"/user-orders"}
                  >
                    Orders
                  </Link>
                  <hr />

                  <motion.div
                    {...buttonClick} onClick={signOut}
                    className="group flex items-center justify-center px-1 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                  >
                    <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
                    <p className="text-textColor text-sm group-hover:text-headingColor">
                      Sign Out
                    </p>
                  </motion.div>

              </motion.div>)}

            </div>
          </> : <>
            <NavLink to={"/login"}>
              <motion.button {...buttonClick}className='px-4 py-2 rounded-md shadow-md bg-white/30 border border-red-300 cursor-pointer'>Login</motion.button>
            </NavLink>
          </>}
        </nav>
    </header>
  )
}

export default Header;