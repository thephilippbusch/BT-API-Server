import { useState, useEffect } from 'react'

import Post from '../pages/post'
import { Spinner } from '../components/loader'
import { sendGraphql } from '../requests'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadPost = ({ match }) => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async (id) => {
      setData({ fetched: null, isFetching: true })
      try {
        const query = `query getPost($id: ID!) {
          get_post(id: $id) {
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
                profile_picture
              }
            }
          }
        }`
        const response = await sendGraphql(
          { query, variables: { id } },
          PUBLIC_API_KEY
        )
        if (!response) {
          setData({ fetched: null, isFetching: false })
          return
        }
        let result = response.data.get_post
        if (!result.success) {
          setData({ fetched: null, isFetching: false })
          return
        }
        setData({ fetched: result.data, isFetching: false })
      } catch (e) {
        console.error(e)
        setData({ fetched: null, isFetching: false })
      }
    }
    fetchData(match.params.pid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return data.fetched && !data.isFetching ? (
    <Post data={data.fetched} />
  ) : (
    <div className="w-full flex justify-center pt-40">
      <Spinner />
    </div>
  )
}

export default LoadPost
