import '../styles/animations.css'

export const Spinner = () => {
  return (
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
  )
}

export const SmallSpinner = () => {
  return (
    <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-8 w-8"></div>
  )
}

export const Pulse = () => {
  return (
    <div className="border border-yellow-700 shadow rounded-md p-4 max-w-2xl w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-yellow-700 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-yellow-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-yellow-700 rounded"></div>
            <div className="h-4 bg-yellow-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
