import { useEffect, useState } from 'react'
import { useAuthContext, useCurrentUser } from '../context'
import { sendGraphql, sendSignUp } from '../requests'

import { PencilAltIcon } from '@heroicons/react/solid'
import ProfilePicture from '../components/profilePicture'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const Settings = ({ data }) => {
  const [profileURL, setProfileURL] = useState()
  const [newProfileURL, setNewProfileURL] = useState('')
  const [profileURLLoading, setProfileURLLoading] = useState(false)
  const [profileURLError, setProfileURLError] = useState()

  const [isEditing, setIsEditing] = useState(true)
  const [email, setEmail] = useState(data.mail)
  const [name, setName] = useState(data.name)
  const [error, setError] = useState()

  let { authToken } = useAuthContext()
  let { currentUser } = useCurrentUser()

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
    if (currentUser) {
      fetchProfileURL(currentUser)
    }
  }, [currentUser])

  const submitChanges = async () => {
    if (email === '' || name === '') {
      setError('Please provide a valid value!')
      return
    }
    if (email === data.mail && name === data.name) {
      setName(data.name)
      setEmail(data.mail)
      setError(null)
      setIsEditing(!isEditing)
      return
    }

    const query = `mutation updateUser($id: ID!, $mail: String, $name: String) {
      update_user(id: $id, mail: $mail, name: $name) {
        success
        error
      }
    }`

    let id = data.id
    const result = await sendGraphql(
      { query, variables: { id, email, name } },
      authToken
    )

    console.log(result)

    setError(null)
    setIsEditing(!isEditing)
  }

  const submitPicture = async () => {
    setProfileURLLoading(true)
    if (newProfileURL === '') {
      setProfileURLError('Please enter a String!')
      return
    }

    const query = `mutation updateUser($id: ID!, $profile_picture: String) {
      update_user(id: $id, profile_picture: $profile_picture) {
        success
        error
      }
    }`

    let id = data.id
    let profile_picture = newProfileURL
    const response = await sendGraphql(
      { query, variables: { id, profile_picture } },
      authToken
    )

    console.log(response)

    setProfileURLLoading(false)
    setProfileURLError(null)
    return
  }

  return (
    <main className="w-full h-full flex justify-center pt-16">
      <div className="w-full xl:w-1/2 h-full overflow-y-auto flex-col">
        <div className="flex flex-col items-center w-full py-10">
          <div>
            <div className="absolute right-0 bottom-0 bg-gray-700 rounded-full p-1">
              <PencilAltIcon className="h-4 w-4 text-white" />
            </div>
            <ProfilePicture url={profileURL} size="16" pad="4" />
          </div>
          <div className="flex flex-row justify-center w-full font-bold pt-4">
            <p className="text-2xl">{data.name}</p>
          </div>
        </div>

        <div className="w-full flex justify-center py-4">
          <div className="w-full px-2 md:w-2/3 flex justify-end">
            {isEditing ? (
              <button
                className="bg-blue-600 text-white rounded py-1 px-3 hover:bg-blue-800"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  className="bg-red-600 text-white rounded py-1 px-3 hover:bg-red-800"
                  onClick={() => {
                    setName(data.name)
                    setEmail(data.mail)
                    setIsEditing(!isEditing)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white rounded py-1 px-3 hover:bg-green-800"
                  onClick={() => {
                    submitChanges()
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full px-3 flex justify-center">
          <table className="w-full md:w-2/3">
            <tbody>
              <tr className="w-full flex flex-row justify-between">
                <td>Email:</td>
                <td className="w-2/3">
                  <input
                    className={`${
                      isEditing
                        ? 'text-gray-500 bg-white border-white'
                        : 'text-black border-gray-500'
                    } p-1 rounded border-2 text-right w-full`}
                    type="email"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    disabled={isEditing}
                  />
                </td>
              </tr>
              <tr className="w-full flex flex-row justify-between">
                <td>Username:</td>
                <td className="w-2/3">
                  <input
                    className={`${
                      isEditing
                        ? 'text-gray-500 bg-white'
                        : 'text-black border-2 border-gray-500'
                    } p-1 rounded text-right w-full`}
                    type="text"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    disabled={isEditing}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {error && (
          <div className="w-full flex justify-center">
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Settings
