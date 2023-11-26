import React from 'react'

const baseClassName = `btn text-gray-50 font-bold py-[8px] px-[20px] rounded-lg justify-center 
items-center inline-flex whitespace-nowrap my-px active:mb-0 active:mt-px transition-all`

export function BtnLink({ href, color, children }) {
  return (
    <a href={href}
      className={`${baseClassName} btn_${color}`}>
      {children}
    </a>
  )
}

export function Button({ color, onClick, type = 'button', children }) {
  return (
    <button onClick={onClick} type={type} className={`${baseClassName} btn_${color}`}>
      {children}
    </button>
  )
}