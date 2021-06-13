import { useState, useEffect } from 'react'

import Settings from '../pages/settings'
import { Spinner } from '../components/loader'

import { sendGraphql } from '../requests'
import { useCurrentUser } from '../context'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadSettings = () => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  let { currentUser } = useCurrentUser()

  useEffect(() => {
    const fetchData = async (uid) => {
      setData({ fetched: null, isFetching: true })
      try {
        const query = `query getUser($uid: ID!) {
          get_user(id: $uid) {
            success
            error
            data {
              id
              name
              mail
              password
              profile_picture
            }
          }
        }`
        const result = await sendGraphql(
          { query, variables: { uid } },
          PUBLIC_API_KEY
        )
        if (result) {
          let res = result.data.get_user
          if (res.success) {
            setData({ fetched: res.data, isFetching: false })
          } else {
            console.error(res.error)
            setData({ fetched: res.error, isFetching: false })
          }
        }
      } catch (e) {
        console.error(e)
        let error = {
          status_code: 400,
          status: 'Error',
          message: `${e}`,
        }
        setData({ fetched: error, isFetching: false })
      }
    }
    fetchData(currentUser)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return data.fetched && !data.isFetching ? (
    <Settings data={data.fetched} />
  ) : (
    <div className="w-full h-5/6 flex justify-center items-center">
      <Spinner />
    </div>
  )
}

export default LoadSettings
