import React, { useEffect, useState } from 'react'
import ProjectItem from '../components/ProjectItem'
import { getProjects } from '../functions/projectAPI'
import Header from '../components/Header'
import Container from '../components/Container'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleResponse } from '../functions/handleResponse'
import Pagination from '../components/Pagination'

const sortValuesList = ['newest', 'oldest', 'alphabetical', 'reverseAlphabetical']

function Home() {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useSearchParams();
  const page = queryParams.get('page')
  const sortParam = queryParams.get('sort')
  const searchParam = queryParams.get('search')
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState((page && !isNaN(page) && Number(page) > 0) ? Number(page) : 1)
  const [pagesCount, setPagesCount] = useState(1);
  const [sort, setSort] = useState(sortValuesList.includes(sortParam) ? sortParam : sortValuesList[0])
  const [search, setSearch] = useState(searchParam ? searchParam : '')

  async function getAndSetProjects() {
    getProjects(currentPage, search, sort)
      .then(response => {
        handleResponse(response, navigate, () => {
          setProjects(response.data.projects)
          setPagesCount(response.data.pages_count)
        }, () => { setProjects([]) }, () => { setProjects([]) })
      })
  }

  useEffect(() => {
    const query = {}
    if (currentPage !== 1) {
      query.page = currentPage;
    }
    if (sort !== sortValuesList[0]) {
      query.sort = sort;
    }
    if (search !== '') {
      query.search = search;
    }
    setQueryParams(query)
    getAndSetProjects();
    scrollToTop();
  }, [currentPage, sort, search])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSort = (e) => {
    setSort(e.target.value)
  }

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header h1_text="ProjectifyWeb" btn_link={{ link: '/create-project', color: 'blue', children: 'Create project' }} />
      <div className="main">
        <div className="section">
          <Container>
            <div className="flex justify-between items-center max-[400px]:flex-wrap gap-[20px]">
              <input type="text" placeholder='Search'
                onChange={handleSearch} value={search}
                className="max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
              text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight" />

              <select
                onChange={handleSort} value={sort}
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
                  <ProjectItem key={project.slug} projectData={project} onDelete={() => { getAndSetProjects() }} />
                )
              })}
              <Pagination currentPage={currentPage} pagesCount={pagesCount} setCurrentPage={setCurrentPage} />
            </div>
          </Container>
        </div>
      </div>
    </div >
  )
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

export default Home