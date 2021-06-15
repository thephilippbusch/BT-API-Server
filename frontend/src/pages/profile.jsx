import { useEffect, useState } from 'react'
import { sendGraphql } from '../requests'

import Result from './post/result'
import ProfilePicture from '../components/profilePicture'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const Profile = ({ data }) => {
  const [profileURL, setProfileURL] = useState()

  useEffect(() => {
    const fetchProfileURL = async (id) => {
      try {
        const query = `query getUser($id: ID!) {
          get_user(id: $id) {
            success
            error
            data {
              profile_picture
            }
          }
        }`
        const response = await sendGraphql(
          { query, variables: { id } },
          PUBLIC_API_KEY
        )
        if (!response) {
          setProfileURL(null)
          return
        }
        const result = response.data.get_user
        if (!result.success) {
          console.error(result.error)
          setProfileURL(null)
          return
        }
        setProfileURL(
          result.data.profile_picture === 'None'
            ? null
            : result.data.profile_picture
        )
      } catch (e) {
        console.error(e)
        setProfileURL(null)
      }
    }
    fetchProfileURL(data.id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="w-full h-full flex justify-center pt-16">
      <div className="w-full xl:w-1/2 h-full overflow-y-auto flex-col">
        <div className="flex flex-col items-center w-full py-10">
          <ProfilePicture url={profileURL} size="16" pad="3" picture="24" />
          <div className="flex flex-row justify-center w-full font-bold pt-4">
            <p className="text-2xl">{data.name}</p>
          </div>

          <p className="w-full px-3 flex justify-around text-sm text-gray-600 font-bold">
            {data.mail}
          </p>
        </div>

        <div className="pt-8">
          {data.posts && data.posts.length > 0 ? (
            data.posts.map(({ id, title, content, user, created }, idx) => {
              return (
                <Result
                  key={idx}
                  title={title}
                  content={content}
                  user={user}
                  created={created}
                  id={id}
                />
              )
            })
          ) : (
            <div>No Posts yet!</div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Profile
