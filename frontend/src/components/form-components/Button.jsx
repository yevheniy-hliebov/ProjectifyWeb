import React from 'react';
import { Link } from 'react-router-dom';

const baseClassName = `btn text-gray-50 font-bold max-sm:text-[16px] max-sm:py-[5px] max-sm:px-[15px] py-[8px] px-[20px] rounded-lg justify-center 
items-center inline-flex whitespace-nowrap my-px active:mb-0 active:mt-px transition-all`;

export default function Button({
  link,
  type = 'button',
  onClick = () => {},
  onChange = () => {},
  name,
  className = '',
  color = 'gray',
  accept,
  children
}) {
  if (type === 'file') {
    return (
      <label className={`${baseClassName} cursor-pointer btn_${color} ${className}`}>
        <input
          type="file"
          accept={accept}
          name={name}
          className="hidden"
          onClick={onClick}
          onChange={onChange}
        />
        {children}
      </label>
    );
  } else {
    const btn = (
      <button
        onClick={onClick}
        type={type}
        className={`${baseClassName} cursor-pointer btn_${color} ${className}`}
      >
        {children}
      </button>
    );
    if (!link) {
      return btn;
    }
    return <Link to={link}>{btn}</Link>;
  }
}
