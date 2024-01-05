import React from 'react'
import Button from '../components/Button'
import Container from '../components/Container'

function InternalServerError() {
  return (
    <Container className='h-screen flex flex-col items-center justify-center gap-3'>
      <div className="text-8xl font-semibold text-gray-800">500</div>
      <p className='text-2xl text-gray-900'>Oops! Internal Server Error</p>
      <Button link='/' color='gray'>Go back to Home</Button>
    </Container>
  )
}

export default InternalServerError