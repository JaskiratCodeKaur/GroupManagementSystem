import React from 'react'
import Header from '../main/Header'

const AdminDashboard = () => {
  return (
    <div className='h-screen w-full p-10'>
        <Header />
        <div>
            <form>
                <h3>Task Title</h3>
                <input type='text' placeholder='' />
                <h3>Description</h3>
                <textarea name='' id='' cols='30' rows='10' placeholder='Description' />
                <h3>Date</h3>
                <input type='date' />
                <h3>Assign To</h3>
                <input type='text' placeholder='employee names'/>
                <h3>Category</h3>
                <input type='text' placeholder='dev, design or cybersecurity'/>
                <button>Create Task</button>
            </form>
        </div>
    </div>
  )
}

export default AdminDashboard