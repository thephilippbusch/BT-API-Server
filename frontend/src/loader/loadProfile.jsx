import { useState, useEffect } from 'react'

import Profile from '../pages/profile'
import { Spinner } from '../components/loader'

const LoadProfile = ({ match }) => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async () => {
      setData({ fetched: null, isFetching: true })
      try {
        const response = await fetch('')
        const result = await response.json()
        if (result) {
          if (result.status_code === 200) {
            setData({ fetched: result.data, isFetching: false })
          }
          if (result.status_code === 400) {
            setData({ fetched: result.message, isFetching: false })
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
    console.log(match.params)
    // fetchData()
  })

  //   return data.fetched && !data.isFetching ? (
  //     <Profile data={data.fetched} />
  //   ) : (
  //     <Spinner />
  //   )
  return <Profile />
}

export default LoadProfile
