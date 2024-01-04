import React from 'react'
import Container from '../components/Container'
import Button from '../components/Button'

function Forbidden() {
  return (
    <Container className='h-screen flex flex-col items-center justify-center gap-3'>
      <div className="text-8xl font-semibold text-gray-800">403</div>
      <p className='text-2xl text-gray-900'>Oops! Forbidden</p>
      <p className='text-base text-gray-900'>Insufficient rights to access.</p>
      <Button link='/' color='gray'>Go back to Home</Button>
    </Container>
  );
}

export default Forbidden