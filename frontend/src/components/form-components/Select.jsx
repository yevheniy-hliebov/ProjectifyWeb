import { useState } from 'react';

function Select({
  label,
  inputValue = '',
  name,
  listOptions = [],
  placeholder,
  onChange = () => {},
  error
}) {
  const [value, setValue] = useState(inputValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="w-full field-block flex flex-col gap-[10px]">
      <label className="w-full text-gray-900 text-base font-bold leading-tight">{label}</label>
      <select
        value={value}
        onChange={handleChange}
        name={name}
        className={`w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] ${error ? 'border-red-500' : ''} 
        text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`}
      >
        <option value="">{placeholder}</option>
        {listOptions.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      {error ? <div className="text-red-500 text-sm font-normal leading-tight">{error}</div> : null}
    </div>
  );
}

export default Select;
