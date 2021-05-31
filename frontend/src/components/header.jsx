import React from 'react'
import { useHistory } from 'react-router'

import icon from '../blogger-icon.png'

const Header = () => {
  let history = useHistory()

  return (
    <div className="h-16 w-full bg-gray-900 px-2 flex flex-row items-center justify-start">
      <div className="flex flex-row justify-start items-center">
        <button onClick={() => history.push('/')}>
          <img className="h-12 w-12" alt="Blogger Icon" src={icon} />
        </button>
        <a className="pl-2 m-0 text-white font-bold text-3xl italic" href="/">
          Blogger
        </a>
      </div>
    </div>
  )
}

export default Header
