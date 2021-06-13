import { useState } from 'react'
import { SmallSpinner } from '../components/loader'
import { sendSignUp } from '../requests'
import { useHistory, useLocation } from 'react-router-dom'

import SHA256 from '../auth/sha256'
import { useAuthContext, useCurrentUser } from '../context'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState()
  const [data, setData] = useState({ fetched: null, isFetching: false })

  let history = useHistory()
  let location = useLocation()
  let { from } = location.state || { from: { pathname: '/' } }

  let { setAuthToken } = useAuthContext()
  let { setCurrentUser } = useCurrentUser()

  const signup = async () => {
    if (email === '' || password === '' || name === '') {
      setError('Please provide Username, Email and Password!')
      setData({ fetched: null, isFetching: false })
      return
    }

    const signupData = await sendSignUp({
      name: name,
      email: email,
      password: SHA256(password),
    })

    if (!signupData) {
      setError('Something went wrong! Maybe refresh the page.')
      setData({ fetched: null, isFetching: false })
      return
    }
    if (!signupData.success) {
      setError(signupData.error)
      setData({ fetched: null, isFetching: false })
      return
    }
    setError(null)

    setAuthToken(signupData.token)
    setCurrentUser(signupData.id)

    setData({ fetched: signupData, isFetching: true })
    history.push(from)
  }

  return (
    <div className="w-full h-full bg-gray-900 sm:bg-white lg:w-2/4 flex justify-center pt-24 sm:pt-0 sm:items-center text-white">
      <div className="flex flex-col px-6 py-8 sm:p-12 space-y-6 sm:rounded-xl sm:shadow-lg w-full sm:w-2/3 max-w-md bg-gray-900">
        <div className="w-full space-y-2">
          <div className="w-full text-center text-white text-3xl font-bold">
            Sign Up
          </div>
          <div className="w-full text-center pb-2 text-gray-300 text-xs">
            or{' '}
            <a className="hover:text-yellow-500 hover:underline" href="/login">
              login
            </a>
            !
          </div>
        </div>
        <div className="w-full space-y-1">
          <p className="">Username:</p>
          <input
            className="w-full bg-transparent hover:bg-gray-800 border-b p-2 focus:outline-none focus:border-yellow-500"
            type="text"
            placeholder="username"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div className="w-full space-y-1">
          <p className="">Email:</p>
          <input
            className="w-full bg-transparent hover:bg-gray-800 border-b p-2 focus:outline-none focus:border-yellow-500"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div className="">
          <p className="">Password:</p>
          <input
            className="w-full bg-transparent hover:bg-gray-800 border-b p-2 focus:outline-none focus:border-yellow-700"
            type="password"
            placeholder="strong password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        {error && (
          <p className="w-full flex justify-center text-center text-red-500">
            {error}
          </p>
        )}
        <div className="w-full flex justify-center">
          {data.isFetching ? (
            <SmallSpinner />
          ) : (
            <button
              className="px-6 py-1 rounded-lg bg-yellow-700 text-gray-200 hover:bg-yellow-800 hover:text-white"
              onClick={() => signup()}
            >
              Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUp
