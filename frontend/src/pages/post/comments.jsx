import { useEffect, useState, Fragment, useRef } from 'react'

import {
  PencilIcon,
  XIcon,
  ExclamationIcon,
  CheckIcon,
} from '@heroicons/react/outline'
import { TrashIcon } from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'

import { useHistory } from 'react-router'
import ProfilePicture from '../../components/profilePicture'
import { useAuthContext, useCurrentUser } from '../../context'
import { sendGraphql } from '../../requests'

const Comment = ({ id, content, created, user, deleteComment }) => {
  const [isMe, setIsMe] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const cancelButtonRef = useRef(null)

  let history = useHistory()
  let { currentUser } = useCurrentUser()
  let { authToken } = useAuthContext()

  const getDateString = (isodate) => {
    let date = new Date(isodate)
    return date.toLocaleDateString('de-DE')
  }

  useEffect(() => {
    if (currentUser === user.id) {
      setIsMe(true)
    }
  }, [user, currentUser])

  const updateComment = async () => {
    try {
      if (editedContent === content) {
        setIsEditing(false)
        return
      }
      const query = `mutation updateComment($id: ID!, $editedContent: String!) {
            update_comment(id: $id, content: $editedContent) {
                success
                error
            }
        }`
      const response = await sendGraphql(
        { query, variables: { id, editedContent } },
        authToken
      )

      if (!response) {
        setEditedContent(content)
        setIsEditing(false)
        return
      }

      let result = response.data.update_comment
      if (!result.success) {
        console.error(result.error)
        setEditedContent(content)
        setIsEditing(false)
        return
      }

      setIsEditing(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="w-full space-y-1">
      <div className="w-full flex justify-between">
        <div
          className="flex justify-start items-center space-x-1 cursor-pointer"
          onClick={() => history.push(`/profile/${user.id}`)}
        >
          <ProfilePicture url={user.profile_picture} size="3" pad="1" />
          <div className="text-gray-600 text-xs font-bold hover:underline">
            {user.name}
          </div>
        </div>
        {}
      </div>
      <div className="flex justify-between items-end">
        {isEditing ? (
          <input
            className="w-full border border-transparent p-1 focus:outline-none focus:border-gray-400 text-sm text-gray-800"
            type="text"
            value={editedContent}
            onChange={({ target }) => setEditedContent(target.value)}
          />
        ) : (
          <div className="w-full text-sm text-gray-800">{editedContent}</div>
        )}
        {isMe &&
          (isEditing ? (
            <div className="flex">
              <button
                className="p-1 rounded-full bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-gray-900"
                onClick={() => updateComment()}
              >
                <CheckIcon className="h-3 w-3 text-gray-900 hover:text-yellow-700" />
              </button>
              <button
                className="p-1 rounded-full bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-gray-900"
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(content)
                }}
              >
                <XIcon className="h-3 w-3 text-gray-900 hover:text-yellow-700" />
              </button>
            </div>
          ) : (
            <button
              className="p-1 rounded-full bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-gray-900"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-3 w-3 text-gray-900 hover:text-yellow-700" />
            </button>
          ))}
        {isMe && (
          <button
            className="p-1 rounded-full bg-transparent border border-transparent hover:bg-gray-200 focus:outline-none focus:border-gray-900"
            onClick={() => setDeleteDialog(true)}
          >
            <TrashIcon className="h-3 w-3 text-gray-900 hover:text-yellow-700" />
          </button>
        )}
        <div className="text-gray-600 text-xs flex flex-row justify-end">
          <p>{getDateString(created)}</p>
        </div>
      </div>

      <Transition.Root show={deleteDialog} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={deleteDialog}
          onClose={setDeleteDialog}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Delete Comment
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your comment? The
                        comment will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => deleteComment(id)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setDeleteDialog(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

const Comments = ({ data }) => {
  const [comments, setComments] = useState(data)

  let { authToken } = useAuthContext()

  const deleteComment = async (id) => {
    try {
      const query = `mutation deleteComment($id: ID!) {
              delete_comment(id: $id) {
                  success
                  error
              }
          }`
      const response = await sendGraphql(
        { query, variables: { id } },
        authToken
      )

      if (!response) {
        return
      }

      let result = response.data.delete_comment
      if (!result.success) {
        console.error(result.error)
        return
      }

      let clearedComments = comments.filter((com) => com.id !== id)
      setComments(clearedComments)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="w-full pl-4 py-1 flex flex-col space-y-2">
      {comments && comments.length > 0 ? (
        comments.map(({ id, content, created, user }, idx) => {
          return (
            <Comment
              key={idx}
              id={id}
              content={content}
              created={created}
              user={user}
              deleteComment={deleteComment}
            />
          )
        })
      ) : (
        <div className="text-sm text-gray-800">No Comments!</div>
      )}
    </div>
  )
}

export default Comments
