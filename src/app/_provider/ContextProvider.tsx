import React from 'react'
import { childrenProps } from '../_utils/_type/commonType'

const ContextProvider = ({children}:childrenProps) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default ContextProvider
