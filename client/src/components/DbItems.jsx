import React from 'react';
import {DataTable} from './';
import { HiCurrencyRupee } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { alertNull, alertSuccess } from '../context/actions/alertActions';

const DbItems = () => {
  const products = useSelector(state => state.products);
  const dispatch = useDispatch();
  return (
    <div className='flex items-center justify-center pt-6 gap-4 w-full'>
      <DataTable columns={[
        {
          title: 'Image',
          field: 'imageURL',
          render: rowData => (
            <img
              className='w-32 h-16 object-contain rounded-md'
              src={rowData.imageURL}
              alt=''
            />
          ),
        }, {
          title: "Name",
          field: "product_name"
        }, {
          title: "Category",
          field: "product_category"
        }, {
          title: "Price",
          field: "product_price",
          render: rowData => {
            return <p className='text-lg font-semibold text-textColor flex items-center justify-center gap-2'>
              <HiCurrencyRupee className='text-red-400'/>
              {parseFloat(rowData.product_price).toFixed(2)};
            </p>
          }
        }

      ]}
        title={"List of Products"}
        data={products}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit Data',
            onClick: (event, rowData) => {
              alert("Edit" + rowData.product_name);
            }
          }, 
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (
                window.confirm("Are you sure, you want to perform this aciton")
              ) {
                deleteAProduct(rowData.product_id).then((res) => {
                  console.log(res);
                  dispatch(alertSuccess("Product Deleted"));
                  setInterval(() => {
                    dispatch(alertNull());
                  }, 3000);
                  getAllProducts().then((data) => {
                    console.log(data);
                    dispatch(setAllProducts(data));
                  });
                });
              }
            },
          }
        ]}
      />
    </div>
  )
}

export default DbItems;