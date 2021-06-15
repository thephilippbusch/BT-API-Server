import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router'
import '../styles/extend.css'

import icon from '../blogger-icon.png'
import { useAuthContext, useCurrentUser } from '../context'
import { sendGraphql } from '../requests'

import { SearchIcon, UserIcon } from '@heroicons/react/solid'
import { LogoutIcon, AdjustmentsIcon } from '@heroicons/react/outline'
import { Popover, Transition } from '@headlessui/react'
import ProfilePicture from './profilePicture'
import { useQuery } from '../context'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const Header = ({ data }) => {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const [profileURL, setProfileURL] = useState()
  let history = useHistory()
  let url_query = useQuery()

  let { authToken, setAuthToken } = useAuthContext()
  let { currentUser, setCurrentUser } = useCurrentUser()

  useEffect(() => {
    if (url_query.get('query')) {
      setQuery(url_query.get('query'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    setAuthToken('')
    setCurrentUser('')

    history.push('/')
  }

  useEffect(() => {
    setProfileURL(data)
  }, [data])

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
          setProfileURL(null)
          return
        }
        setProfileURL(
          result.data.profile_picture === 'None'
            ? null
            : result.data.profile_picture
        )
      } catch (e) {
        setProfileURL(null)
      }
    }
    if (currentUser) {
      fetchProfileURL(currentUser)
    }
  }, [currentUser])

  const submitQuery = () => {
    if (query === '' || !query) {
      setError(true)
      return
    }
    let queryString = `/search?query=${query}`
    setError(false)

    history.push(queryString)
  }

  const profileMenuItems = [
    {
      title: 'Settings',
      icon: <AdjustmentsIcon className="h-6 w-6 text-white" />,
      func: () => history.push(`/settings`),
    },
    {
      title: 'Profile',
      icon: <UserIcon className="h-6 w-6 text-white" />,
      func: () => history.push(`/profile/${currentUser}`),
    },
    {
      title: 'Log Out',
      icon: <LogoutIcon className="h-6 w-6 text-white" />,
      func: () => logout(),
    },
  ]

  return (
    <div className="header h-full w-full bg-gray-900 px-2 flex flex-row items-center justify-between">
      <div className="flex flex-row justify-start items-center">
        <button onClick={() => history.push('/')}>
          <img className="h-12 w-12" alt="Blogger Icon" src={icon} />
        </button>
        <a className="pl-2 m-0 text-white font-bold text-3xl italic" href="/">
          Blogger
        </a>
      </div>

      <div
        className={`w-1/2 flex bg-white justify-between items-center py-1 px-2`}
      >
        <input
          className={`w-full border-b ${
            error ? 'border-red-500' : 'border-transparent'
          } focus:outline-none`}
          type="search"
          placeholder="search..."
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
        <button
          className="flex p-2 items-center text-gray-600 hover:text-gray-800 focus:outline-none focus:text-black"
          onClick={() => submitQuery()}
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </button>
      </div>

      {authToken && currentUser ? (
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="rounded-full h-full flex items-centermr-2 focus:outline-none border-transparent border-2 focus:border-gray-300">
                <ProfilePicture
                  url={profileURL}
                  size="8"
                  pad="4"
                  picture="12"
                />
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className="absolute z-10 right-0 mt-5 w-52"
                >
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="flex flex-col bg-gray-900">
                      {profileMenuItems.map(({ title, icon, func }, idx) => {
                        return (
                          <div
                            key={idx}
                            className="w-full flex justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700"
                            onClick={func}
                          >
                            <p className="text-white text-lg font-bold">
                              {title}
                            </p>
                            {icon}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      ) : (
        <div className="flex justify-end space-x-2 pr-2">
          <button
            className="py-2 px-4 text-white bg-yellow-700"
            onClick={() => history.push('/login')}
          >
            Login
          </button>
          <button
            className="py-2 px-4 text-white"
            onClick={() => history.push('/signup')}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  )
}

export default Header
