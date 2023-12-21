import React, { useEffect, useState } from 'react'
import Button from './Button'
import Container from './Container'
import ProfileDropdown from './ProfileDropdown'
import { checkIsAuthorized } from '../functions/authApi'

function Header({ h1_text, btn_link = null }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [username, setUsername] = useState(null)
  const { link, color, children } = btn_link || {}

  useEffect(() => {
    checkIsAuthorized().then(response => {
      if (!response || response.status === 401) {
        setIsAuthorized(false)
      } else {
        setIsAuthorized(true)
        setUsername(response.data.username);
      }
    })
  }, [])

  return (
    <div className="header py-[25px]">
      <Container>
        <div className="flex justify-between items-center flex-wrap gap-[20px]">
          <h1 className="grow shrink basis-0 text-gray-900 text-[38px] max-sm:text-[30px] font-bold leading-[44px] whitespace-nowrap">{h1_text}</h1>
          {btn_link && <Button link={link} color={color}>{children}</Button>}
          {isAuthorized ? <ProfileDropdown username={username} setIsAuthorized={setIsAuthorized} /> :
            <div className='justify-start items-center gap-2.5 inline-flex'>
              <Button link="/login" color="red">Log In</Button>
              <Button link="/register" color="gray">Sign Up</Button>
            </div>
          }
        </div>
      </Container>
    </div>
  )
}

export default Header