import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ProfilePicture from '../components/profilePicture'
import { useAuthContext, useCurrentUser } from '../context'
import LoadComments from '../loader/loadComments'
import { PencilAltIcon, XIcon } from '@heroicons/react/solid'
import { sendGraphql } from '../requests'

const Post = ({ data }) => {
  const { id, title, content, created, user } = data
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState(false)

  const [comments, setComments] = useState(
    id ? <LoadComments pid={id} /> : null
  )

  let history = useHistory()
  let { authToken } = useAuthContext()
  let { currentUser } = useCurrentUser()

  const getDateString = (isodate) => {
    let date = new Date(isodate)
    return date.toLocaleDateString('de-DE')
  }

  const submitComment = async () => {
    if (newComment === '') {
      setError('Enter a valid value!')
      return
    }

    let content = newComment
    let uid = currentUser
    let pid = id
    const query = `mutation createComment($pid: ID!, $uid: ID!, $content: String!) {
      create_comment(pid: $pid, uid: $uid, content: $content) {
        success
        error
        id
      }
    }`
    const response = await sendGraphql(
      { query, variables: { pid, uid, content } },
      authToken
    )

    console.log(response)

    if (!response) {
      setError('Something went wrong')
      return
    }

    let result = response.data.create_comment
    if (!result.success) {
      console.error(result.error)
      setError(result.error)
      return
    }

    setComments(null)
    setComments(<LoadComments pid={id} />)
    setCommenting(false)
  }

  return (
    <div className="w-full flex justify-center pt-8">
      <div className="p-1 flex flex-col space-y-2 w-1/2">
        <p className="text-xl font-bold">{title}</p>
        <div className="w-full flex justify-start">
          <div
            className="flex flex-row items-center space-x-1 cursor-pointer"
            onClick={() => history.push(`/profile/${user.id}`)}
          >
            <ProfilePicture url={user.profile_picture} size="4" pad="1" />
            <p className="text-gray-600 text-xs font-bold hover:underline">
              {user.name}
            </p>
          </div>
        </div>
        {(content || content !== 'None') && <div>{content}</div>}
        <div className="text-gray-600 text-xs w-full flex flex-row justify-end">
          <p>{getDateString(created)}</p>
        </div>

        <div className="w-full flex justify-start">
          <button
            className="text-xs text-gray-600 hover:underline hover:text-yellow-700 focus:outline-none"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? 'hide comments' : 'show comments'}
          </button>
        </div>

        {showComments && (
          <div>
            {comments}
            {currentUser && authToken ? (
              commenting ? (
                <div className="w-full p-2 flex justify-between items-center space-x-4">
                  <input
                    className={`w-full text-sm p-1 ${
                      error
                        ? 'border-b-2 border-red-500'
                        : 'border-b border-gray-900'
                    } focus:outline-none focus:border-yellow-700 hover:bg-gray-200`}
                    type="text"
                    value={newComment}
                    onChange={({ target }) => {
                      setNewComment(target.value)
                      setError(null)
                    }}
                    placeholder="leave a comment"
                  />
                  <button
                    className="rounded-full p-1 bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-yellow-700"
                    onClick={() => submitComment()}
                  >
                    <PencilAltIcon className="h-4 w-4 text-yellow-700" />
                  </button>
                  <button
                    className="rounded-full p-1 bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-yellow-700"
                    onClick={() => setCommenting(false)}
                  >
                    <XIcon className="h-4 w-4 text-yellow-700" />
                  </button>
                </div>
              ) : (
                <div className="pl-4">
                  <button
                    className="w-auto text-gray-500 text-xs hover:underline hover:text-yellow-700 focus:outline-none focus:text-yellow-700"
                    onClick={() => setCommenting(!commenting)}
                  >
                    comment
                  </button>
                </div>
              )
            ) : (
              <p className="text-gray-500 text-xs italic">
                <a
                  className="hover:underline hover:text-yellow-700"
                  href="/login"
                >
                  Login
                </a>{' '}
                to write a comment
              </p>
            )}
            {error && (
              <div className="w-full text-center text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
