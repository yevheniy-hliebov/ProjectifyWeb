import React, { useEffect, useState } from 'react'
import ProjectItem from '../components/ProjectItem'
import { getProjects } from '../functions/projectAPI'
import Header from '../components/Header'
import Container from '../components/Container'
import { useNavigate } from 'react-router-dom'
import { handleResponse } from '../functions/handleResponse'

function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([])
  const [query, setQuery] = useState({
    sortBy: 'newest',
    searchText: ''
  })

  async function getAndSetProjects(query) {
    getProjects(query.searchText, query.sortBy)
      .then(response => {
        handleResponse(response, navigate, () => {
          setProjects(response.data.projects)
        }, () => { setProjects([]) }, () => { setProjects([]) })
      })
  }

  useEffect(() => {
    getAndSetProjects(query);
  }, [query])

  const handleSearch = (e) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      searchText: e.target.value,
    }))
  }

  const handleSort = (e) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      sortBy: e.target.value,
    }))
  }

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header h1_text="ProjectifyWeb" btn_link={{ link: '/create-project', color: 'blue', children: 'Create project' }} />
      <div className="main">
        <div className="section">
          <Container>
            <div className="flex justify-between items-center max-[400px]:flex-wrap gap-[20px]">
              <input type="text" placeholder='Search'
                onChange={handleSearch} value={query.searchText}
                className="max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight" />

              <select
                onChange={handleSort} value={query.sortBy}
                className="min-[400px]:max-w-[200px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
              text-base font-normal text-gray-900">
                <option value="newest">Newest to oldest</option>
                <option value="oldest">Oldest to newest</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="reverseAlphabetical">Reverse alphabetical</option>
              </select>
            </div>
          </Container>
        </div>

        <div className="section">
          <Container>
            <div className="flex flex-col">
              {(projects.length === 0) && <div className="mx-auto my-3 text-2xl text-gray-500">Projects not found</div>}
              {projects.map(project => {
                return (
                  <ProjectItem key={project.slug} projectData={project} onDelete={() => { console.log(2); getAndSetProjects(query.searchText, query.sortBy) }} />
                )
              })}
            </div>
          </Container>
        </div>
      </div>
    </div >
  )
}

export default Home