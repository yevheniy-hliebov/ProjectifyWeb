import React from 'react';
import { useState } from 'react';

function Textarea({ label, inputValue = '', placeholder, onChange, error, maxLength }) {
  const [value, setValue] = useState(inputValue);
  const handleTextarea = (e) => {
    e.target.style.height = '';
    e.target.style.height = e.target.scrollHeight + 2 + 'px';

    setValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="field-block flex flex-col gap-[10px]">
      {label ? (
        <label className="w-full text-gray-900 text-base font-bold leading-tight">{label}</label>
      ) : null}
      <div className="relative">
        <textarea
          className={`min-h-[120px] resize-none w-full p-[10px] border border-gray-500 focus:outline-blue-400 ${inputValue.length > maxLength || error ? 'border-red-500' : ''} rounded-[3px] 
        text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`}
          value={value}
          onChange={handleTextarea}
          placeholder={placeholder}
        />
        {maxLength ? (
          <div
            className={`absolute bottom-3 right-2 self-end ${inputValue.length > maxLength ? 'text-red-500' : 'text-gray-500'} text-sm font-normal leading-tight`}
          >
            {inputValue.length}/{maxLength}
          </div>
        ) : null}
      </div>
      {error ? <div className="text-red-500 text-sm font-normal leading-tight">{error}</div> : null}
    </div>
  );
}

export default Textarea;
