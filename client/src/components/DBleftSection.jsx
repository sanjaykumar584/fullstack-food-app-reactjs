import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';

const DBleftSection = () => {
  return (
    <div className='h-full py-12 flex flex-col bg-white/30 backdrop-blur-md shadow-md min-w-210 w-300 gap-3'>
        <NavLink to={"/"} className="flex items-center justify-start px-6 gap-4">
            <img src={logo} className='w-12' alt=''/>
            <p className='font-semibold text-xl'>City</p>
        </NavLink>

        <hr />

        <ul className='flex flex-col gap-4'>
            <NavLink className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500` : isNotActiveStyles} to={"/dashboard/home"}>Home</NavLink>
            <NavLink className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500` : isNotActiveStyles} to={"/dashboard/orders"}>Orders</NavLink>
            <NavLink className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500` : isNotActiveStyles} to={"/dashboard/items"}>Items</NavLink>
            <NavLink className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500` : isNotActiveStyles} to={"/dashboard/addNewItem"}>Add New Item</NavLink>
            <NavLink className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500` : isNotActiveStyles} to={"/dashboard/users"}>Users</NavLink>
        </ul>

        <div className="w-full items-center justify-center flex h-225 mt-auto px-2 ">
        <div className="w-full h-full rounded-md bg-red-400 flex items-center justify-center flex-col gap-3 px-3">
          <div className="w-12 h-12 borde bg-white rounded-full flex items-center justify-center">
            <p className="text-2xl font-bold text-red-500">?</p>
          </div>
          <p className="text-xl text-primary font-semibold">Help Center</p>
          <p className="text-base text-gray-300 text-center">
            Having trouble in city. Please contact us for more questions
          </p>
          <p className="px-4 py-2 rounded-full bg-primary text-red-400 cursor-pointer">
            Get in touch
          </p>
        </div>
      </div>

    </div>
  )
}

export default DBleftSection