import { useState, useEffect } from 'react'

import Comments from '../pages/post/comments'
import { SmallSpinner } from '../components/loader'
import { sendGraphql } from '../requests'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadComments = ({ pid }) => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async (pid) => {
      try {
        const query = `query getComments($pid: ID!) {
                    get_comments(pid: $pid) {
                        success
                        error
                        data {
                            id
                            content
                            created
                            user {
                                id
                                name
                                profile_picture
                            }
                            post {
                                id
                            }
                        }
                    }
                }`
        const response = await sendGraphql(
          { query, variables: { pid } },
          PUBLIC_API_KEY
        )
        if (!response) {
          setData({ fetched: { data: [] }, isFetching: false })
          return
        }

        let result = response.data.get_comments
        if (!result.success) {
          console.error(result.error)
          setData({ fetched: { data: [] }, isFetching: false })
          return
        }
        setData({ fetched: result.data, isFetching: false })
      } catch (e) {
        console.error(e)
        setData({ fetched: null, isFetching: false })
      }
    }
    fetchData(pid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return data.fetched && !data.isFetching ? (
    <Comments data={data.fetched} />
  ) : (
    <div className="w-full flex justify-center">
      <SmallSpinner />
    </div>
  )
}

export default LoadComments
