import { useState } from 'react'

import { ChevronRightIcon, XIcon } from '@heroicons/react/outline'
import { SmallSpinner } from '../../components/loader'
import { sendGraphql } from '../../requests'
import { useAuthContext, useCurrentUser } from '../../context'

const CreatePost = ({ setNewPost }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [data, setData] = useState({ fetched: null, isFetching: false })
  const [error, setError] = useState()

  let { currentUser } = useCurrentUser()
  let { authToken } = useAuthContext()

  const createPost = async () => {
    setData({ fetched: null, isFetching: true })
    if (title === '') {
      setError('Please provide a title!')
      setData({ fetched: null, isFetching: false })
      return
    }

    setContent(content === '' ? null : content)
    let uid = currentUser
    const query = `mutation createPost($uid: ID!, $title: String!, $content: String) {
      create_post(uid: $uid, title: $title, content: $content) {
        success
        error
        id
      }
    }`
    const response = await sendGraphql(
      { query, variables: { uid, title, content } },
      authToken
    )

    console.log(response)
    setError(null)
    setNewPost(false)
  }

  const closeModal = () => {
    setNewPost(false)
  }

  return (
    <div className="space-y-2">
      <p as="h3" className="text-lg leading-6 font-medium text-gray-900">
        New Post
      </p>
      <input
        className="w-full bg-transparent border-b border-b p-2 focus:outline-none focus:border-yellow-700"
        type="text"
        placeholder="Title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
      <textarea
        className="w-full border p-2 focus:outline-none focus:border-yellow-700"
        name="content"
        rows="5"
        placeholder="content"
        value={content}
        onChange={({ target }) => setContent(target.value)}
      />
      {error && (
        <div className="w-full text-center text-sm text-red-500">{error}</div>
      )}
      <div className="mt-5 sm:mt-6 w-full flex justify-end">
        {data.isFetching ? (
          <SmallSpinner />
        ) : (
          <button
            type="button"
            className="flex justify-center items-center rounded-md border border-transparent shadow-sm pl-4 pr-2 py-2 bg-yellow-700 text-base font-medium text-white hover:bg-yellow-800 focus:outline-none sm:text-sm"
            onClick={() => createPost()}
          >
            Post <ChevronRightIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div
        className="absolute right-0 top-0 mr-2 mt-2 p-2 rounded-full cursor-pointer hover:bg-gray-200"
        onClick={() => closeModal()}
      >
        <XIcon className="h-6 h-6" />
      </div>
    </div>
  )
}

export default CreatePost
