import React from 'react'
import Header from '../components/Header'
import FormProject from '../components/FormProject'

function CreateProject({ authUser, setAuthUser }) {
  return (
    <div className='wrapper w-full min-h-screen bg-gray-50'>
      <Header h1_text={'Create project'} authUser={authUser} setAuthUser={setAuthUser}/>
      <div className="section">
        <FormProject />
      </div>
    </div>
  )
}

export default CreateProject