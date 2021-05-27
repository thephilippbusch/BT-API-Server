import { useState, useEffect } from 'react'

import Home from '../pages/home'
import { Spinner } from '../components/loader'

const LoadHome = () => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async () => {
      setData({ fetched: null, isFetching: true })
      try {
        const response = await fetch('http://localhost:8000/test?q=ping')
        const result = await response.json()
        console.log(result)
        if (result) {
          if (result.status_code === 200) {
            setData({ fetched: result.data, isFetching: false })
          }
          if (result.status_code === 400) {
            console.error(result.message)
            setData({ fetched: result.message, isFetching: false })
          }
        }
      } catch (e) {
        console.error(e)
        let error = {
          status: 'Error',
          status_code: '400',
          message: `${e}`,
        }
        setData({ fetched: error, isFetching: false })
      }
    }
    fetchData()
  }, [])

  return data.fetched && !data.isFetching ? (
    <Home data={data.fetched} />
  ) : (
    <Spinner />
  )
}

export default LoadHome
