import React from 'react'

const className = `btn text-gray-50 font-bold py-[8px] px-[20px] rounded-lg justify-center 
items-center inline-flex whitespace-nowrap my-px active:mb-0 active:mt-px transition-all`

export function BtnLink({ href, color, children }) {
  return (
    <a href={href}
      className={`btn_${color} ` + className}>
      {children}
    </a>
  )
}

export function Button({ color, onClick, children }) {
  return (
    <button className={`btn_${color} ` + className} onClick={onClick}>
      {children}
    </button>
  )
}