import React, { useEffect, useState } from 'react'
import { BtnLink } from '../components/Button.component'
import ProjectItem from '../components/ProjectItem.component'
import { getProjects } from '../functions/requests'

function Home() {
  const [projects, setProjects] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [searchText, setSearchText] = useState('')

  function getAndSetProjects(searchText = '', sortBy = '') {
    getProjects(searchText, sortBy)
      .then(projects => {
        setProjects(projects)
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }

  useEffect(() => {
    getAndSetProjects(searchText, sortBy);
  }, [])



  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <div className="header py-[25px]">
        <div className="container max-w-[1440px] mx-auto px-[15px] flex justify-end items-center flex-wrap gap-[20px]">
          <h1 className="grow shrink basis-0 text-gray-900 text-[38px] font-bold leading-[44px] whitespace-nowrap">List of projects</h1>
          <BtnLink href='/projects/new' color={'blue'}>Create project</BtnLink>
        </div>
      </div>
      <div className="main">
        <div className="section">
          <div className="container max-w-[1440px] mx-auto px-[15px] flex justify-between items-center flex-wrap gap-[20px]">

            <input type="text" placeholder='Search'
              onChange={(e) => { setSearchText(e.target.value); setTimeout(() => getAndSetProjects(e.target.value, sortBy), 0) }}
              className="max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
                text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight" />

            <select
              onChange={(e) => { setSortBy(e.target.value); setTimeout(() => getAndSetProjects(searchText, e.target.value), 0) }} value={sortBy}
              className="max-w-[300px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
                text-base font-normal text-gray-900">
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="reverseAlphabetical">Reverse alphabetical</option>
            </select>
          </div>
        </div>

        <div className="section">
          <div className="container max-w-[1440px] mx-auto px-[15px] flex flex-col">
            {projects.map(project => {
              return (
                <ProjectItem key={project.slug} projectData={project} onDelete={() => { getAndSetProjects(searchText, sortBy) }} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home