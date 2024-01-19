import React from 'react';
import Container from '../Container';
import ProfileDropdown from '../ProfileDropdown';

function Header({ title = 'ProjectifyWeb', buttons }) {
  return (
    <header className="header py-[25px]">
      <Container>
        <div className="flex justify-between items-center flex-wrap gap-x-5 gap-y-1 max-[430px]:flex-col max-[430px]:items-center">
          <h1 className="text-gray-900 text-[38px] max-sm:text-[24px] font-bold whitespace-nowrap">
            {title}
          </h1>
          <div className="flex items-center gap-1 max-[430px]:self-end">
            {buttons}
            <ProfileDropdown />
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
