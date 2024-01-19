import React from 'react';

function Pagination({ currentPage, pagesCount, setCurrentPage = () => {} }) {
  if (!pagesCount) return null;
  if (pagesCount < 2 || pagesCount === 0) return null;
  const isTruncated = pagesCount > 6;

  const numberButtons = [];
  if (!isTruncated) {
    for (let page = 1; page <= pagesCount; page++) {
      numberButtons.push(createNumberButton(page));
    }
  } else {
    if (currentPage < 4) {
      console.log(currentPage);
      for (let page = 1; page <= 4; page++) {
        numberButtons.push(createNumberButton(page));
      }
      numberButtons.push(createNumberButton('...', 'last'));
      numberButtons.push(createNumberButton(pagesCount));
    } else if (pagesCount - 4 < currentPage) {
      console.log(currentPage);
      numberButtons.push(createNumberButton(1));
      numberButtons.push(createNumberButton('...', 'first'));
      for (let page = pagesCount - 4 + 1; page <= pagesCount; page++) {
        numberButtons.push(createNumberButton(page));
      }
    } else if (currentPage >= 4 && currentPage <= pagesCount - 4) {
      console.log(currentPage);
      numberButtons.push(createNumberButton(1));
      numberButtons.push(createNumberButton('...', 'first'));
      for (let page = currentPage - 1; page <= currentPage + 1; page++) {
        numberButtons.push(createNumberButton(page));
      }
      numberButtons.push(createNumberButton('...', 'last'));
      numberButtons.push(createNumberButton(pagesCount));
    }
  }

  return (
    <nav className="my-2 mx-auto">
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            className={`w-[75px] flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg ${currentPage !== 1 ? 'hover:bg-gray-100 hover:text-gray-700' : 'bg-gray-200'}`}
          >
            Previous
          </button>
        </li>
        <div className="max-[380px]:hidden flex">{numberButtons}</div>
        <li>
          <button
            type="button"
            disabled={currentPage === pagesCount}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            className={`w-[75px] flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg ${currentPage !== pagesCount ? 'hover:bg-gray-100 hover:text-gray-700' : 'bg-gray-200'}`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );

  function createNumberButton(number, key) {
    return (
      <li key={key ? key : number}>
        <button
          type="button"
          disabled={number === currentPage || number === '...'}
          onClick={() => {
            if (number !== '...') setCurrentPage(number);
          }}
          className={`flex items-center justify-center px-3 h-8 leading-tigh border border-gray-300 ${number === currentPage ? 'text-blue-600 bg-blue-50' : `text-gray-500 bg-white ${number !== '...' ? 'hover:bg-gray-100 hover:text-gray-700' : ''}`}`}
        >
          {number}
        </button>
      </li>
    );
  }
}

export default Pagination;
