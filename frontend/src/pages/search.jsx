import Result from './post/result'

const Search = ({ data }) => {
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
    </div>
  )
}

export default Search
