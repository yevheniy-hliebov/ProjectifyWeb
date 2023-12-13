import React from 'react'

function Container({className = '', children}) {
  return (
    <div className={'container max-w-[1440px] mx-auto px-[15px] ' + className}>
        {children}
    </div>
  )
}

export default Container