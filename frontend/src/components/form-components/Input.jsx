import { useState } from 'react';

function Input({
  label,
  name,
  inputValue = '',
  type = 'text',
  placeholder,
  onChange = () => {},
  error,
  message
}) {
  const [value, setValue] = useState(inputValue);
  const handleOnChange = (e) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="w-full field-block flex flex-col gap-[10px]">
      {label ? (
        <label className="w-full text-gray-900 text-base font-bold leading-tight">{label}</label>
      ) : null}
      <div className="flex flex-col gap-[5px]">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleOnChange}
          className={`w-full p-[10px] cursor-text border border-gray-500 focus:outline-blue-400 rounded-[3px] ${error ? 'border-red-500' : ''} 
        text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight`}
        />
        {message ? (
          <div className="text-gray-500 text-sm font-normal leading-tight">{message}</div>
        ) : null}
        {error ? (
          <div className="text-red-500 text-sm font-normal leading-tight">{error}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Checkbox({ label, checked, name, onChange = () => {} }) {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleOnChange = (e) => {
    setIsChecked((prev) => !prev);
    onChange(e);
  };

  return (
    <div className="checkbox-wrapper">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          name={name}
          className={isChecked ? 'checked' : ''}
          checked={isChecked}
          onChange={handleOnChange}
        />
        <span className="w-full select-none text-gray-900 text-base font-bold leading-tight">
          {label}
        </span>
      </label>
    </div>
  );
}

export default Input;
