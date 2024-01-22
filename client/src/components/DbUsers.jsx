import React, { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import {getAllUsers} from "../api"
import { setAllUserDetails } from '../context/actions/allUserActions';
import DataTable from './DataTable';
import Avatar from '../assets/img/avatar-man.png';

const DbUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, []);
  
  return (
    <div className='flex items-center justify-center pt-6 gap-4 w-full'>
      <DataTable columns={[
        {
          title: 'Image',
          field: 'photoURL',
          render: rowData => (
            <img
              className='w-32 h-16 object-contain rounded-md'
              src={rowData.photoURL ? rowData.photoURL : Avatar}
              alt=''
            />
          ),
        }, {
          title: "Name",
          field: "displayName"
        }, {
          title: "Email",
          field: "email"
        }, {
            title: "Verified",
            field: "emailVerified",
            render: (rowData) => (
              <p
                className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
                  rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {rowData.emailVerified ? "Verified" : "Not Verified"}
              </p>
            ),
          }

      ]}
        title={"List of Users"}
        data={allUsers}
        // actions={[
        //   {
        //     icon: 'edit',
        //     tooltip: 'Edit Data',
        //     onClick: (event, rowData) => {
        //       alert("Edit" + rowData.product_name);
        //     }
        //   }, 
        //   {
        //     icon: "delete",
        //     tooltip: "Delete Data",
        //     onClick: (event, rowData) => {
        //       if (
        //         window.confirm("Are you sure, you want to perform this aciton")
        //       ) {
        //         deleteAProduct(rowData.product_id).then((res) => {
        //           console.log(res);
        //           dispatch(alertSuccess("Product Deleted"));
        //           setInterval(() => {
        //             dispatch(alertNull());
        //           }, 3000);
        //           getAllProducts().then((data) => {
        //             console.log(data);
        //             dispatch(setAllProducts(data));
        //           });
        //         });
        //       }
        //     },
        //   }
        // ]}
      />
    </div>
  )
}

export default DbUsers