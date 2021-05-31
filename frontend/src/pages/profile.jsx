import { useState } from 'react'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(true)

  return (
    <main className="w-full h-full flex justify-center pt-16">
      <div className="w-full xl:w-1/2 h-full overflow-y-auto flex-col">
        <div className="flex flex-col items-center w-full py-10">
          <div className="h-24 w-24 rounded-full border-black border-2 flex justify-center items-center shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex flex-row justify-center w-full font-bold pt-4">
            <p className="text-2xl">Phillex</p>
          </div>
        </div>

        <div className="w-full flex justify-center py-4">
          <div className="w-full px-2 md:w-2/3 flex justify-end">
            {isEditing ? (
              <button
                className="bg-blue-600 text-white rounded py-1 px-3 hover:bg-blue-800"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  className="bg-red-600 text-white rounded py-1 px-3 hover:bg-red-800"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white rounded py-1 px-3 hover:bg-green-800"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full px-3 flex justify-center">
          <table className="w-full md:w-2/3">
            <tr className="w-full flex flex-row justify-between">
              <td>Email:</td>
              <td className="w-2/3">
                <input
                  className={`${
                    isEditing
                      ? 'text-gray-500 bg-white border-white'
                      : 'text-black border-gray-500'
                  } p-1 rounded border-2 text-right w-full`}
                  type="email"
                  value="philippleonbusch@gmail.com"
                  onChange={({ target }) => console.log(target.value)}
                  disabled={isEditing}
                />
              </td>
            </tr>
            <tr className="w-full flex flex-row justify-between">
              <td>Password:</td>
              <td className="w-2/3">
                <input
                  className={`${
                    isEditing
                      ? 'text-gray-500 bg-white'
                      : 'text-black border-2 border-gray-500'
                  } p-1 rounded text-right w-full`}
                  type="password"
                  value="12345"
                  onChange={({ target }) => console.log(target.value)}
                  disabled={isEditing}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Profile
