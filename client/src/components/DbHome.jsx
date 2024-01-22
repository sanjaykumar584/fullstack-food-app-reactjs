import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts, getAllUsers } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { CChart } from '@coreui/react-chartjs';
import {setAllUserDetails} from '../context/actions/allUserActions'

const DbHome = () => {
  const products = useSelector(state => state.products);
  const dispatch = useDispatch();

  const drinks = products?.filter(item => item.product_category == 'drinks');
  const desserts = products?.filter(item => item.product_category == 'deserts');
  const fruits = products?.filter(item => item.product_category == 'fruits');
  const rice = products?.filter(item => item.product_category == 'rice');
  const curry = products?.filter(item => item.product_category == 'curry');
  const chinese = products?.filter(item => item.product_category == 'chinese');
  const bread = products?.filter(item => item.product_category == 'bread');

  useEffect(() => {
    if (!products) {
      getAllProducts().then(data => {
        dispatch(setAllProducts(data));
      });
    }
  });

  const allUsers = useSelector((state) => state.allUsers);

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center pt-6 w-full h-full'>
      <div className='h-full w-full grid grid-cols-1 md:grid-cols-2 gap-4 '>
        <div className='flex items-center justify-center'>
          <div className='w-340 md:w-508'>
          <CChart
            type="bar"
            data={{
              labels: ['Dessert', 'Drinks', 'Fruits', 'Rice', 'Curry', 'Chinese', 'Bread'],
              datasets: [
                {
                  label: 'Category Wise Count',
                  backgroundColor: '#f87979',
                  data: [
                    desserts?.length,
                    drinks?.length,
                    fruits?.length,
                    rice?.length,
                    curry?.length,
                    chinese?.length,
                    bread?.length,
                  ],
                },
              ],
            }}
            labels="months"
          />
          </div>
        </div>
        <div className='flex items-center justify-center w-full h-full'>
          <div className='w-275 md:w-460'>
            <CChart
              type="doughnut"
              data={{
                labels: ['Orders', 'Delivered', 'Cancelled', 'Paid', 'Not Paid'],
                datasets: [
                  {
                    backgroundColor: [
                      "#51FF00",
                      "#00B6FF",
                      "#008BFF",
                      "#FFD100",
                      "#FF00FB",
                    ],
                    data: [40, 20, 80, 34, 54],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DbHome