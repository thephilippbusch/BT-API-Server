import React from 'react'
import '../styles/extend.css'
import HomeResult from '../home/result'

const mock_data = [
  {
    title: 'Mein erster Blog!',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
    gravida dui, ac malesuada tellus. Proin non erat non urna volutpat
    porta nec ac sapien. Duis aliquet ligula a felis lobortis ultrices.
    Suspendisse at quam purus. Curabitur sit amet iaculis metus, vitae
    condimentum nunc. Pellentesque ut vulputate turpis, at varius
    mauris. Nam vel interdum nibh. Etiam luctus massa pretium velit
    rutrum consectetur. Maecenas purus risus, cursus eget felis iaculis,
    interdum congue nisl. Nulla vitae quam a enim pretium porttitor sed
    eu nulla.`,
    creation_date: 1622707920,
    user: {
      mail: 'philippleonbusch@gmail.com',
      name: 'Phillex',
      profile_picture: 'some_link',
    },
  },
  {
    title: 'Mein zweiter Blog!',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
    gravida dui, ac malesuada tellus. Proin non erat non urna volutpat
    porta nec ac sapien. Duis aliquet ligula a felis lobortis ultrices.
    Suspendisse at quam purus. Curabitur sit amet iaculis metus, vitae
    condimentum nunc. Pellentesque ut vulputate turpis, at varius
    mauris. Nam vel interdum nibh. Etiam luctus massa pretium velit
    rutrum consectetur. Maecenas purus risus, cursus eget felis iaculis,
    interdum congue nisl. Nulla vitae quam a enim pretium porttitor sed
    eu nulla.`,
    creation_date: 1620998820,
    user: {
      mail: 'philippleonbusch@gmail.com',
      name: 'Phillex',
      profile_picture: 'some_link',
    },
  },
]

const Home = ({ data }) => {
  return (
    <div className="h-full w-full p-4 flex justify-center">
      <div className="w-1/2 flex flex-col items-center">
        {mock_data.map(({ title, content, user, creation_date }, idx) => {
          return (
            <HomeResult
              key={idx}
              title={title}
              content={content}
              user={user}
              creation_date={creation_date}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Home
