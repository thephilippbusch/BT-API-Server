import React from 'react'
import { useHistory } from 'react-router'

const Home = ({ data }) => {
  let history = useHistory()

  return (
    <div className="h-full w-full p-4 flex justify-center">
      <div className="flex flex-col items-center">
        <div className="w-2/3 p-1 flex flex-col space-y-2">
          <a
            className="text-xl font-bold hover:text-yellow-700"
            href="https://www.google.de"
            target="_blank"
            rel="noreferrer"
          >
            Mein erster Blog!
          </a>
          <div
            className="flex flex-row items-center space-x-1 cursor-pointer"
            onClick={() => history.push('/')}
          >
            <img
              alt="profile"
              src="blogger-icon.png"
              className="h-5 w-5 rounded-full border-black border-1"
            />
            <p className="text-gray-600 text-xs font-bold hover:underline">
              Philipp Busch
            </p>
          </div>
          <div className="text-sm break-words text-gray-800">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
            gravida dui, ac malesuada tellus. Proin non erat non urna volutpat
            porta nec ac sapien. Duis aliquet ligula a felis lobortis ultrices.
            Suspendisse at quam purus. Curabitur sit amet iaculis metus, vitae
            condimentum nunc. Pellentesque ut vulputate turpis, at varius
            mauris. Nam vel interdum nibh. Etiam luctus massa pretium velit
            rutrum consectetur. Maecenas purus risus, cursus eget felis iaculis,
            interdum congue nisl. Nulla vitae quam a enim pretium porttitor sed
            eu nulla.
          </div>
          <div className="text-gray-600 text-xs w-full flex flex-row justify-end">
            <p>11.05.21</p>
          </div>
        </div>

        <div className="w-2/3 p-1 flex flex-col space-y-2">
          <a
            className="text-xl font-bold hover:text-yellow-700"
            href="https://www.google.de"
            target="_blank"
            rel="noreferrer"
          >
            Mein zweiter Blog!
          </a>
          <div
            className="flex flex-row items-center space-x-1 cursor-pointer"
            onClick={() => history.push('/')}
          >
            <img
              alt="profile"
              src="blogger-icon.png"
              className="h-5 w-5 rounded-full border-black border-1"
            />
            <p className="text-gray-600 text-xs font-bold hover:underline">
              Philipp Busch
            </p>
          </div>
          <div className="text-sm break-words text-gray-800">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
            gravida dui, ac malesuada tellus. Proin non erat non urna volutpat
            porta nec ac sapien. Duis aliquet ligula a felis lobortis ultrices.
            Suspendisse at quam purus. Curabitur sit amet iaculis metus, vitae
            condimentum nunc. Pellentesque ut vulputate turpis, at varius
            mauris. Nam vel interdum nibh. Etiam luctus massa pretium velit
            rutrum consectetur. Maecenas purus risus, cursus eget felis iaculis,
            interdum congue nisl. Nulla vitae quam a enim pretium porttitor sed
            eu nulla.
          </div>
          <div className="text-gray-600 text-xs w-full flex flex-row justify-end">
            <p>11.05.21</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
