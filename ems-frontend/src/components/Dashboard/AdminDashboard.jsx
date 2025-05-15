import React from 'react'
import Header from '../main/Header'
import CreateTask from '../main/CreateTask'
import AllTask from '../main/AllTask'

const AdminDashboard = () => {
  return (
    <div className='h-screen w-full p-10'>
        <Header />
        <CreateTask />
        <AllTask />
    </div>
  )
}

export default AdminDashboard