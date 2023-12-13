import React from 'react'
import { Link } from 'react-router-dom';

const baseClassName = `btn text-gray-50 font-bold py-[8px] px-[20px] rounded-lg justify-center 
items-center inline-flex whitespace-nowrap my-px active:mb-0 active:mt-px transition-all`

export default function Button({ link, onClick, color, type = 'button', children }) {
  const btn = (
    <button onClick={onClick} type={type} className={`${baseClassName} btn_${color}`}>
      {children}
    </button>
  )
  if (!link) {
    return btn; 
  }
  return (
    <Link to={link}>
      {btn}
    </Link>
  )
}