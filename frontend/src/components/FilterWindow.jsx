import React from 'react';
import Button from './form-components/Button';

function FilterWindow({ handleApplyFilter, children }) {
  return (
    <div className="filter fixed z-50 top-0 left-0 size-full pointer-events-none bg-gray-900 bg-opacity-0 opacity-0 overflow-hidden">
      <div className="filter-window overflow-y-auto absolute top-0 right-0 translate-x-full max-w-96 w-full h-screen bg-gray-50">
        <form name="form-filter" className="form pt-12 p-6 flex flex-col gap-4">
          <div className="text-gray-900 text-[32px] max-sm:text-[20px] font-bold leading-9">
            Filter
          </div>
          {children}
          <Button type="button" color="blue" onClick={handleApplyFilter}>
            Apply
          </Button>
        </form>
        <div className="absolute top-2 left-2 cursor-pointer" onClick={CloseFilter}>
          <svg
            className="size-5 hover:scale-110"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z"
              fill="#111827"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function OpenFilter() {
  const filter = document.querySelector('.filter');
  if (filter) {
    filter.classList.add('filter_open');
    document.body.classList.add('non-scroll');
  }
}

export function CloseFilter() {
  const filter = document.querySelector('.filter');
  if (filter) {
    filter.classList.remove('filter_open');
  }
  if (document.body.classList.contains('non-scroll')) {
    document.body.classList.remove('non-scroll');
  }
}

export default FilterWindow;
