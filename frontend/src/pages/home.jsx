import React, { Fragment, useState } from 'react'
import '../styles/extend.css'
import '../styles/animations.css'
import Result from './post/result'
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline'
import { useAuthContext, useCurrentUser } from '../context'
import { Dialog, Transition } from '@headlessui/react'

import CreatePost from './home/createPost'

const Home = ({ data }) => {
  const [newPost, setNewPost] = useState(false)
  const [refreshAnimation, setRefreshAnimation] = useState(0)

  let { currentUser } = useCurrentUser()
  let { authToken } = useAuthContext()

  return (
    <div className="h-full w-full p-4 flex justify-center overflow-y-auto">
      <div className="w-1/2 flex flex-col items-center">
        {data.success ? (
          data.data.map(({ id, title, content, user, created }, idx) => {
            return (
              <Result
                key={idx}
                title={title}
                content={content}
                user={user}
                created={created}
                id={id}
              />
            )
          })
        ) : (
          <div>No Results!</div>
        )}
      </div>

      <div
        className="absolute right-0 top-0 mr-64 mt-24 p-2 rounded-full cursor-pointer hover:bg-gray-200"
        onClick={() => {
          window.location.reload()
          setRefreshAnimation(1)
        }}
      >
        <RefreshIcon className="spin h-6 w-6" rotation={refreshAnimation} />
      </div>

      {authToken && currentUser && (
        <div
          className="absolute right-0 bottom-0 mr-6 mb-6 rounded-full p-3 bg-yellow-700 cursor-pointer"
          onClick={() => setNewPost(true)}
        >
          <PlusIcon className="h-8 w-8 text-white" />
        </div>
      )}

      <Transition.Root show={newPost} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0"
          open={newPost}
          onClose={setNewPost}
        >
          <div className="flex items-end justify-center h-screen pt-4 px-4 pb-4 text-center sm:p-0">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-2 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-4">
                <CreatePost setNewPost={setNewPost} />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default Home
