import React, { useEffect } from 'react'
import {Cart, FilterSection, Header, Home, HomeSlider} from '../components'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';

const Main = () => {
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, []);

  return (
    <main className='w-full min-h-screen flex items-center justify-start flex-col bg-primary'>
      <Header />
      <div className='w-[90%] flex flex-col items-start justify-center mt-40 px-6 md:px-24 gap-12 pb-24'>
        <Home />
        <HomeSlider />
        <FilterSection />
      </div>

      {isCart && <Cart />}

    </main>
  )
}

export default Main