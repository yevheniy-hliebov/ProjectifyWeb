import React from 'react'

function Container({children}) {
  return (
    <div className='container max-w-[1440px] mx-auto px-[15px]'>
        {children}
    </div>
  )
}

export default Container