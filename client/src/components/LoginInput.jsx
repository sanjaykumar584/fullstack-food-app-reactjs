import React, { useState } from 'react'
import {motion} from 'framer-motion';
import { fadeInOut } from '../animations';

const LoginInput = (Props) => {
    const [isFocus, setIsFocus] = useState(false);
  return (
    <motion.div {...fadeInOut} className={`flex items-center justify-center gap-4 backdrop-blur-md rounded-md bg-white/30 w-full px-4 py-2 ${isFocus ? "shadow-md shadow-red-400" : "shadow-none"}`}>
        {Props.icon}
        <input type={Props.text} placeholder={Props.placeHolder} 
            className=' w-full h-full bg-transparent text-textColor text-lg font-semibold border-none outline-none' 
            value={Props.inputState} onChange={(event) => Props.inputStateFunc(event.target.value)}
            onFocus={() => {setIsFocus(true)}}
            onBlur={() => {setIsFocus(false)}}
        />
    </motion.div>
  )
}

export default LoginInput