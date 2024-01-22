import React, { useState } from 'react'
import { statuses } from '../utils/styles'
import {Spinner} from './';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { alertDanger, alertNull, alertSuccess } from '../context/actions/alertActions';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { MdDelete } from 'react-icons/md';
import ProgressBar from "@ramonak/react-progress-bar";
import { addNewProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';

const DbAddNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [itemPrice, setItemPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const uploadImage = (event) => {
    setIsLoading(true);
    const imageFile = event.target.files[0];
    const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on("state_changed", (snapshot) => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    }, (error)  => {
      dispatch(alertDanger(`Error : ${error}`));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageDownloadURL(downloadURL);
        setIsLoading(false);
        setProgress(null);
        dispatch(alertSuccess("Image Uploaded to the cloud"));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      });
    })
  }

  const deleteImageFromFirebase = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);
    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setIsLoading(false);
      dispatch(alertSuccess("Image Removed from the cloud"));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
    })
  }

  const submitNewData = () => {
    const data = {
      product_name: itemName,
      product_category: category,
      product_price: itemPrice,
      imageURL: imageDownloadURL
    }
    addNewProduct(data).then(res => {
      console.log(res);
      dispatch(alertSuccess("New Item added"));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
      setImageDownloadURL(null);
      setItemName("");
      setItemPrice("");
      setCategory(null);
    });
    getAllProducts(data => {
      dispatch(setAllProducts(data));
    })
  }
  
  return (
    <div className='flex items-center justify-center flex-col pt-6 px-24 w-full'>
      <div className='border border-gray-300 rounded-md p-4 w-full flex flex-col justify-center items-center gap-4'>
        <InputValueField 
          type="text"
          placeHolder={"Item name here"}
          stateValue={itemName}
          stateFunc={setItemName}
        />

      <div className='w-full flex items-center justify-around gap-3 flex-wrap'>
        {statuses && statuses?.map(data => (
          <p key={data.id}
            onClick={() => {setCategory(data.category)}}
            className={`${data.category === category ? "bg-red-400 text-white/90" : "bg-transparent"} px-4 py-3 rounded-md text-lg text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md`}>
            {data.title}
          </p>
        ))}
      </div>

      <InputValueField 
        type="number"
        placeHolder="Item price here"
        stateValue={itemPrice}
        stateFunc={setItemPrice}
      />

        <div className='w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
          {isLoading ? <div className='w-full h-full flex flex-col items-center justify-center px-24'>
            <Spinner />
            {progress > 0 ? <ProgressBar className='w-full' bgColor='rgb(239 68 68)' completed={Math.round(progress)} /> : null }
          </div> 
          : 
          <div className='h-full w-full flex justify-center items-center'>
            {!imageDownloadURL ? <>
              <label>
                <div className='flex flex-col items-center justify-center h-full w-full cursor-pointer'>
                  <div className='flex flex-col items-center justify-center h-full w-full cursor-pointer'>
                    <p className='font-bold text-4xl'><FaCloudUploadAlt /></p>
                    <p className='text-lg text-textColor'>Click to Upload an Image</p>
                  </div>
                </div>
                <input 
                  type='file'
                  name='upload-image'
                  accept='image/*'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            </> : <>
              <div className='relative w-full h-full overflow-hidden rounded-md'>
                <motion.img 
                  whileHover={{scale: 1.15}}
                  src={imageDownloadURL}
                  className='w-full h-full object-cover'
                />
                <motion.button 
                  {...buttonClick}
                  type='button'
                  className='absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out'
                  onClick={() => deleteImageFromFirebase(imageDownloadURL)}
                >
                  <MdDelete className='-rotate-0'/>
                </motion.button>
              </div>
            </>}
          </div> }
        </div>

        <motion.button onClick={submitNewData} {...buttonClick} className='w-9/12 py-3 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer'>
              Save
        </motion.button>
      </div>
    </div>
  )
}

export const InputValueField = ({ type, placeHolder, stateValue, stateFunc }) => {
  return <>
    <input 
      type={type}
      placeholder={placeHolder}
      className='w-full px-4 py-3 bg-white/30 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400'
      value={stateValue}
      onChange={(event) => {stateFunc(event.target.value)} }
    />
  </>
}

export default DbAddNewItem