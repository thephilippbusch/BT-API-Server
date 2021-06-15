import { useState, useEffect } from 'react'

import Profile from '../pages/profile'
import { Spinner } from '../components/loader'

import { sendGraphql } from '../requests'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadProfile = ({ match }) => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  useEffect(() => {
    const fetchData = async (uid) => {
      setData({ fetched: null, isFetching: true })
      try {
        let result = null
        let query = ''

        query = `query getUser($uid: ID!) {
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
        const profileResult = await sendGraphql(
          { query, variables: { uid } },
          PUBLIC_API_KEY
        )

        if (!profileResult) {
          setData({ fetched: null, isFetching: false })
          return
        }

        let profileData = profileResult.data.get_user
        if (!profileData.success) {
          console.error(profileData.error)
          setData({ fetched: null, isFetching: false })
          return
        }

        result = profileData.data

        query = `query getPostsByUid($uid: ID!) {
          get_posts_by_uid(uid: $uid) {
            success
            error
            data {
              id
              title
              content
              user {
                id
                name
                profile_picture
              }
              created
            }
          }
        }`
        const postResult = await sendGraphql(
          { query, variables: { uid } },
          PUBLIC_API_KEY
        )

        if (!postResult) {
          setData({ fetched: null, isFetching: false })
          return
        }

        let postData = postResult.data.get_posts_by_uid
        if (!postData.success) {
          console.error(postData.error)
          setData({ fetched: null, isFetching: false })
          return
        }

        result['posts'] = postData.data

        if (!result) {
          setData({ fetched: null, isFetching: false })
          return
        }

        setData({ fetched: result, isFetching: false })
      } catch (e) {
        console.error(e)
        setData({ fetched: null, isFetching: false })
      }
    }
    fetchData(match.params.uid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return data.fetched && !data.isFetching ? (
    <Profile data={data.fetched} />
  ) : (
    <div className="w-full h-5/6 flex justify-center items-center">
      <Spinner />
    </div>
  )
}

export default LoadProfile
