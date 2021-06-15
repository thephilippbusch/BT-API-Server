import { useEffect, useState } from 'react'
import { Spinner } from '../components/loader'
import SearchResults from '../pages/search'
import { sendGraphql } from '../requests'
import { useQuery } from '../context'

const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_GATEWAY_KEY

const LoadSearch = () => {
  const [data, setData] = useState({ fetched: null, isFetching: false })

  let query = useQuery()

  useEffect(() => {
    const fetchData = async (param) => {
      setData({ fetched: null, isFetching: true })
      try {
        const query = `query get_posts_by_query($param: String!) {
          get_posts_by_query(query: $param) {
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
          { query, variables: { param } },
          PUBLIC_API_KEY
        )

        if (!response) {
          console.error('No response')
          setData({ fetched: null, isFetching: false })
          return
        }

        let result = response.data.get_posts_by_query
        if (!result.success) {
          console.error(result.error)
          setData({ fetched: null, isFetching: false })
          return
        }

        setData({ fetched: result, isFetching: false })
      } catch (e) {
        console.error(e)
        setData({ fetched: null, isFetching: false })
      }
    }
    fetchData(query.get('query'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return data.fetched && !data.isFetching ? (
    <SearchResults data={data.fetched} />
  ) : (
    <div className="w-full flex justify-center p-24">
      <Spinner />
    </div>
  )
}

export default LoadSearch
