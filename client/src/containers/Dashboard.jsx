import React from 'react'
import { DBleftSection, DBrightSection } from '../components'

const Dashboard = () => {
  return (
    <div className='w-screen h-screen flex items-center bg-primary'>
        <DBleftSection />
        <DBrightSection />
    </div>
  )
}

export default Dashboard