import React from 'react'
import icon from '../blogger-icon.png'
import { useHistory } from 'react-router-dom'

const HomeResult = ({ title, user, content, creation_date }) => {
  let history = useHistory()

  const getDateString = (timstamp) => {
    let date = new Date(timstamp * 1000)
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
  }

  return (
    <div className="p-1 flex flex-col space-y-2">
      <a
        className="text-xl font-bold hover:text-yellow-700"
        href="https://www.google.de"
      >
        {title}
      </a>
      <div
        className="flex flex-row items-center space-x-1 cursor-pointer"
        onClick={() => history.push('/')}
      >
        <img
          alt="profile"
          src={icon}
          className="h-5 w-5 rounded-full border-black border-1"
        />
        <p className="text-gray-600 text-xs font-bold hover:underline">
          {user.name}
        </p>
      </div>
      <div className="paragraph">{content}</div>
      <div className="text-gray-600 text-xs w-full flex flex-row justify-end">
        <p>{getDateString(creation_date)}</p>
      </div>
    </div>
  )
}

export default HomeResult
