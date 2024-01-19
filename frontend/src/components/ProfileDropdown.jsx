import { useContext } from 'react';
import { AuthContext } from '../App';
import cookie from '../modules/cookie';
import { useNavigate } from 'react-router-dom';

function ProfileDropdown() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useContext(AuthContext);

  document.addEventListener('click', (event) => {
    const detailsElement = document.querySelector('.profile-dropdown');
    if (detailsElement) {
      const isClickInsideDetails = detailsElement.contains(event.target);
      if (!isClickInsideDetails) {
        detailsElement.removeAttribute('open');
      }
    }
  });

  const handleLogout = (e) => {
    cookie.delete('jwt-token');
    setAuthUser(null);
    navigate('/login');
  };

  if (!authUser) return null;
  return (
    <details className="profile-dropdown relative select-none">
      <summary className="list-none cursor-pointer p-[10px] group">
        <svg
          className="size-9 max-sm:size-8"
          viewBox="0 0 37 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-gray-900 group-hover:fill-gray-700 group-active:fill-gray-800"
            d="M7.43 27.68C8.96 26.51 10.67 25.5875 12.56 24.9125C14.45 24.2375 16.43 23.9 18.5 23.9C20.57 23.9 22.55 24.2375 24.44 24.9125C26.33 25.5875 28.04 26.51 29.57 27.68C30.62 26.45 31.4375 25.055 32.0225 23.495C32.6075 21.935 32.9 20.27 32.9 18.5C32.9 14.51 31.4975 11.1125 28.6925 8.3075C25.8875 5.5025 22.49 4.1 18.5 4.1C14.51 4.1 11.1125 5.5025 8.3075 8.3075C5.5025 11.1125 4.1 14.51 4.1 18.5C4.1 20.27 4.3925 21.935 4.9775 23.495C5.5625 25.055 6.38 26.45 7.43 27.68ZM18.5 20.3C16.73 20.3 15.2375 19.6925 14.0225 18.4775C12.8075 17.2625 12.2 15.77 12.2 14C12.2 12.23 12.8075 10.7375 14.0225 9.5225C15.2375 8.3075 16.73 7.7 18.5 7.7C20.27 7.7 21.7625 8.3075 22.9775 9.5225C24.1925 10.7375 24.8 12.23 24.8 14C24.8 15.77 24.1925 17.2625 22.9775 18.4775C21.7625 19.6925 20.27 20.3 18.5 20.3ZM18.5 36.5C16.01 36.5 13.67 36.0275 11.48 35.0825C9.29 34.1375 7.385 32.855 5.765 31.235C4.145 29.615 2.8625 27.71 1.9175 25.52C0.9725 23.33 0.5 20.99 0.5 18.5C0.5 16.01 0.9725 13.67 1.9175 11.48C2.8625 9.29 4.145 7.385 5.765 5.765C7.385 4.145 9.29 2.8625 11.48 1.9175C13.67 0.9725 16.01 0.5 18.5 0.5C20.99 0.5 23.33 0.9725 25.52 1.9175C27.71 2.8625 29.615 4.145 31.235 5.765C32.855 7.385 34.1375 9.29 35.0825 11.48C36.0275 13.67 36.5 16.01 36.5 18.5C36.5 20.99 36.0275 23.33 35.0825 25.52C34.1375 27.71 32.855 29.615 31.235 31.235C29.615 32.855 27.71 34.1375 25.52 35.0825C23.33 36.0275 20.99 36.5 18.5 36.5ZM18.5 32.9C20.09 32.9 21.59 32.6675 23 32.2025C24.41 31.7375 25.7 31.07 26.87 30.2C25.7 29.33 24.41 28.6625 23 28.1975C21.59 27.7325 20.09 27.5 18.5 27.5C16.91 27.5 15.41 27.7325 14 28.1975C12.59 28.6625 11.3 29.33 10.13 30.2C11.3 31.07 12.59 31.7375 14 32.2025C15.41 32.6675 16.91 32.9 18.5 32.9ZM18.5 16.7C19.28 16.7 19.925 16.445 20.435 15.935C20.945 15.425 21.2 14.78 21.2 14C21.2 13.22 20.945 12.575 20.435 12.065C19.925 11.555 19.28 11.3 18.5 11.3C17.72 11.3 17.075 11.555 16.565 12.065C16.055 12.575 15.8 13.22 15.8 14C15.8 14.78 16.055 15.425 16.565 15.935C17.075 16.445 17.72 16.7 18.5 16.7Z"
            fill="#111827"
          />
        </svg>
      </summary>
      <div className="profile-dropdown-content absolute top-full right-[10px] w-[160px] max-sm:w-[140px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-50 z-[1] rounded-[3px] border border-gray-500">
        <div className="w-full px-2.5 py-[10px] flex-col justify-center items-start gap-2.5 inline-flex border-b border-gray-500">
          <div className="self-stretch text-center text-gray-900 text-lg max-sm:text-base font-normal truncate">
            {authUser.username}
          </div>
        </div>
        <ul className="flex-col justify-start items-start flex">
          <li
            className="w-full px-2.5 py-[7px] flex-col justify-center items-start flex hover:bg-gray-100 cursor-pointer text-gray-900 text-base font-normal leading-tight"
            onClick={handleLogout}
          >
            Log out
          </li>
        </ul>
      </div>
    </details>
  );
}

export default ProfileDropdown;
