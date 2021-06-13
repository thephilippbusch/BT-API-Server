import { UserIcon } from '@heroicons/react/solid'

const ProfilePicture = ({ url, size, pad }) => {
  return (
    <>
      {url && url !== 'None' ? (
        <img
          src={url}
          alt="profile"
          className={`h-${size} w-${size} rounded-full border-black border-1`}
        />
      ) : (
        <div className={`p-${pad} rounded-full bg-yellow-700`}>
          <UserIcon
            className={`h-${size} w-${size} rounded-full text-white border-black border-1`}
          />
        </div>
      )}
    </>
  )
}

export default ProfilePicture
