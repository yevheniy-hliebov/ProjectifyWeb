import React from 'react'

function Input({label, inputValue = "", type = "text", placeholder, onChange, error}) {
  return (
    <div className="w-full field-block flex flex-col gap-[10px]">
      <label className="w-full text-gray-900 text-base font-bold leading-tight">{label}</label>
      <input type={type} placeholder={placeholder} value={inputValue} onChange={onChange}
        className={`w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] ${error && 'border-red-500'} 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`} />
      {error && (
        <div className="text-red-500 text-sm font-normal leading-tight">{error}</div>
      )}
    </div>
  )
}

export default Input