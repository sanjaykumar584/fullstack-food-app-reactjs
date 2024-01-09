import { motion } from 'framer-motion';
import React from 'react';
import { fadeInOut } from '../animations';
import { FaCheck } from 'react-icons/fa';
import { BsExclamation, BsExclamationTriangle, BsExclamationTriangleFill } from "react-icons/bs";

const Alert = (props) => {
    if (props.type === "success") {
        return (
          <motion.div className='fixed z-30 top-32 right-12 px-4 py-2 rounded-md bg-emerald-300 backdrop-blur-sm shadow-md flex items-center gap-4' {...fadeInOut}>
            <FaCheck className='text-xl text-emerald-700'/>
            <p className='text-xl text-emerald-700'>{props.message}</p>
          </motion.div>
        )
    }
    
    if (props.type === "warning") {
        return (
          <motion.div className='fixed z-30 top-32 right-12 px-4 py-2 rounded-md bg-orange-300 backdrop-blur-sm shadow-md flex items-center gap-4' {...fadeInOut}>
            <BsExclamation className='text-xl text-orange-700'/>
            <p className='text-xl text-orange-700'>{props.message}</p>
          </motion.div>
        )
    }
    if (props.type === "danger") {
        return (
          <motion.div className='fixed z-30 top-32 right-12 px-4 py-2 rounded-md bg-red-300 backdrop-blur-sm shadow-md flex items-center gap-4' {...fadeInOut}>
            <BsExclamationTriangleFill className='text-xl text-red-700'/>
            <p className='text-xl text-red-700'>{props.message}</p>
          </motion.div>
        )
    }
    if (props.type === "info") {
        return (
          <motion.div className='fixed z-30 top-32 right-12 px-4 py-2 rounded-md bg-blue-300 backdrop-blur-sm shadow-md flex items-center gap-4' {...fadeInOut}>
            <BsExclamation className='text-xl text-blue-700'/>
            <p className='text-xl text-blue-700'>{props.message}</p>
          </motion.div>
        )
    }
}

export default Alert