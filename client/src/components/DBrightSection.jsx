import React from 'react';
import { Routes, Route } from "react-router-dom";
import { DbAddNewItem, DbHeader, DbHome, DbItems, DbOrders, DbUsers } from "./";

const DBrightSection = () => {
  return (
    <div className='flex flex-col py-10 px-12 flex-1 h-full'>
      <DbHeader />

      <div className='flex flex-col flex-1 overflow-y-scroll scrollbar-none'>
        <Routes >
          <Route path='/home' element={<DbHome />}/>
          <Route path='/orders' element={<DbOrders />}/>
          <Route path='/items' element={<DbItems />}/>
          <Route path='/addNewItem' element={<DbAddNewItem />}/>
          <Route path='/users' element={<DbUsers />}/>
        </Routes>
      </div>
    </div>
  )
}

export default DBrightSection