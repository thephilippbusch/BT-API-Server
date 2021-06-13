import { useState, useEffect } from 'react'

import Home from '../pages/home'
import { Pulse } from '../components/loader'

import { sendGraphql } from '../requests'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadHome = () => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async () => {
      setData({ fetched: null, isFetching: true })
      try {
        const query = `query getLatestPosts {
          get_latest_posts {
            success
            error
            data {
              id
              title
              content
              created
              user {
                id
                name
              }
            }
          }
        }`
        const result = await sendGraphql({ query }, PUBLIC_API_KEY)

        if (result) {
          let res = result.data.get_latest_posts
          if (res.success) {
            setData({ fetched: res, isFetching: false })
          } else {
            console.error(res.error)
            setData({ fetched: res, isFetching: false })
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
    <div className="w-full py-3 space-y-3">
      {[0, 1, 2].map((key) => (
        <Pulse key={key} />
      ))}
    </div>
  )
}

export default LoadHome
