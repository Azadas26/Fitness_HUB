import React from 'react'
import { Outlet } from 'react-router-dom'

const DocrorRoot = () => {
  return (
    <>
    <h1>doctor Root</h1>
   <Outlet/>
    </>
  )
}

export default DocrorRoot