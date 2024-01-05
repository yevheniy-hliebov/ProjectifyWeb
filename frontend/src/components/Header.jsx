import React from 'react'
import Button from './Button'
import Container from './Container'
import ProfileDropdown from './ProfileDropdown'

function Header({ h1_text, btn_link = null, authUser, setAuthUser }) {
  const { link, color, children } = btn_link || {}

  return (
    <div className="header py-[25px]">
      <Container>
        <div className="flex justify-between items-center flex-wrap gap-[20px]">
          <h1 className="grow shrink basis-0 text-gray-900 text-[38px] max-sm:text-[30px] font-bold leading-[44px] whitespace-nowrap">{h1_text}</h1>
          {btn_link && <Button link={link} color={color}>{children}</Button>}
          {authUser ? <ProfileDropdown username={authUser.username} setIsAuthorized={setAuthUser} /> : null}
        </div>
      </Container>
    </div>
  )
}

export default Header