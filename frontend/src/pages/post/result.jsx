import React from 'react'
import { useHistory } from 'react-router-dom'

import ProfilePicture from '../../components/profilePicture'

const Result = ({ id, title, user, content, created }) => {
  let history = useHistory()

  const getDateString = (isodate) => {
    let date = new Date(isodate)
    return date.toLocaleDateString('de-DE')
  }

  return (
    <div className="p-1 flex flex-col space-y-2 w-full">
      <p
        className="text-xl font-bold hover:text-yellow-700 cursor-pointer"
        onClick={() => history.push(`/post/${id}`)}
      >
        {title}
      </p>
      <div className="">
        <div
          className="flex flex-row items-center space-x-1 cursor-pointer"
          onClick={() => history.push(`/profile/${user.id}`)}
        >
          <ProfilePicture url={user.profile_picture} size="3" pad="1" />
          <p className="text-gray-600 text-xs font-bold hover:underline">
            {user.name}
          </p>
        </div>
      </div>
      {(content || content !== 'None') && (
        <div className="paragraph">{content}</div>
      )}
      <div className="text-gray-600 text-xs w-full flex flex-row justify-end">
        <p>{getDateString(created)}</p>
      </div>
    </div>
  )
}

export default Result
