export const Spinner = () => {
  let circleCommonClasses = 'h-2 w-2 bg-yellow-700 rounded-full'

  return (
    <div className="flex">
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div
        className={`${circleCommonClasses} mr-1 animate-bounce delay-200`}
      ></div>
      <div className={`${circleCommonClasses} animate-bounce delay-400`}></div>
    </div>
  )
}

export const Pulse = () => {
  return (
    <div className="border border-light-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-light-blue-400 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-light-blue-400 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-light-blue-400 rounded"></div>
            <div className="h-4 bg-light-blue-400 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
