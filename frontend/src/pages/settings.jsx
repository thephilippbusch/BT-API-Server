import { useEffect, useState, Fragment } from 'react'
import { useAuthContext, useCurrentUser } from '../context'
import { sendGraphql } from '../requests'
import { Dialog, Transition } from '@headlessui/react'

import { PencilIcon, XIcon } from '@heroicons/react/solid'
import ProfilePicture from '../components/profilePicture'
import { SmallSpinner } from '../components/loader'

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

  const [changingPicture, setChangingPicture] = useState(false)

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
      setProfileURLError('Please enter a picture URL!')
      setProfileURLLoading(false)
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

    if (!response) {
      setProfileURLLoading(false)
      setProfileURLError('Something went wrong while uploading!')
      return
    }

    const result = response.data.update_user
    if (!result.success) {
      setProfileURLLoading(false)
      setProfileURLError(result.error)
      return
    }

    setProfileURLLoading(false)
    setProfileURLError(null)
    setChangingPicture(false)
    return
  }

  return (
    <main className="w-full h-full flex justify-center pt-16">
      <div className="w-full xl:w-1/2 h-full overflow-y-auto flex-col">
        <div className="flex flex-col items-center w-full py-10">
          <div className="flex jutify-center items-end">
            <ProfilePicture url={profileURL} size="16" pad="4" picture="20" />
            <div
              className="rounded-full bg-gray-700 p-2 -ml-6 cursor-pointer hover:bg-gray-500"
              onClick={() => setChangingPicture(true)}
            >
              <PencilIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-row justify-center w-full font-bold pt-4">
            <p className="text-2xl">{data.name}</p>
          </div>
        </div>

        <Transition.Root show={changingPicture} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed z-10 inset-0 overflow-y-auto"
            open={changingPicture}
            onClose={setChangingPicture}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                  <div
                    className="absolute right-0 top-0 mr-2 mt-2 p-2 rounded-full cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setChangingPicture(false)
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Change Profile Picture
                      </Dialog.Title>
                      <div className="mt-2">
                        <input
                          className="w-full border-b border-black bg-transparent hover:bg-gray-100 focus:outline-none focus:border-yellow-700"
                          type="text"
                          placeholder="url"
                          onChange={({ target }) =>
                            setNewProfileURL(target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {profileURLError && (
                    <div className="w-full text-center text-xs text-red-500 py-2">
                      {profileURLError}
                    </div>
                  )}

                  <div className="flex justify-around pt-2">
                    {profileURLLoading ? (
                      <SmallSpinner />
                    ) : (
                      <>
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 focus:outline-none py-2 px-4 rounded"
                          onClick={() => setChangingPicture(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none py-2 px-4 rounded"
                          onClick={() => submitPicture()}
                        >
                          Upload
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

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
