import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/section-components/Header';
import Button from '../components/form-components/Button';
import Container from '../components/Container';
import ProjectItem from '../components/ProjectItem';
import Pagination from '../components/Pagination';
import Input, { Checkbox } from '../components/form-components/Input';
import { getProjects } from '../api/projects';
import Loading from '../components/Loading';
import FilterWindow, { CloseFilter, OpenFilter } from '../components/FilterWindow';
import scrollTop from '../modules/scroll-top';

const sortValuesList = ['newest', 'oldest', 'alphabetical', 'reverseAlphabetical'];
const queryList = [
  'page',
  'sort',
  'search',
  'has_description',
  'no_description',
  'created',
  'updated'
];
const valueTrue = ['', 'true'];

document.addEventListener('click', (e) => {
  const filter = document.querySelector('.filter');
  const filterWindow = document.querySelector('.filter-window');
  const btnFilter = document.querySelector('.btn-filter');
  if (filter) {
    const isClickFilter = filterWindow.contains(e.target);
    const isClickBtn = btnFilter.contains(e.target);
    if (!isClickFilter && !isClickBtn && filter.classList.contains('filter_open')) {
      filter.classList.remove('filter_open');
      if (document.body.classList.contains('non-scroll')) {
        document.body.classList.remove('non-scroll');
      }
    }
  }
});

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let queryParams = {};
  queryList.forEach((queryKey) => {
    queryParams[queryKey] = searchParams.get(queryKey);
  });

  const [currentPage, setCurrentPage] = useState(
    queryParams.page && !isNaN(queryParams.page) && Number(queryParams.page) > 0
      ? Number(queryParams.page)
      : 1
  );
  const [pagesCount, setPagesCount] = useState(1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState(
    sortValuesList.includes(queryParams.sort) ? queryParams.sort : sortValuesList[0]
  );
  const [search, setSearch] = useState(queryParams.search ? queryParams.search : '');

  const [filter, setFilter] = useState({
    has_description: valueTrue.includes(queryParams.has_description).toString(),
    no_description: valueTrue.includes(queryParams.no_description).toString(),
    created: queryParams.created ? queryParams.created : '',
    updated: queryParams.updated ? queryParams.updated : ''
  });

  const getAndSetProjects = (query) => {
    getProjects(query).then((res) => {
      if (!res || res?.status === 500) {
        navigate('/500');
      } else if (res?.status === 200) {
        setProjects(res.data.projects);
        setPagesCount(res.data.pages_count);
        setLoading(false);
      } else if (res?.status === 401) {
        navigate('/login');
      }
    });
  };

  const getQueryObject = () => {
    const query = {};
    if (currentPage !== 1) {
      query.page = currentPage;
    }
    if (sort !== sortValuesList[0]) {
      query.sort = sort;
    }
    if (search !== '') {
      query.search = search;
    }
    if (search !== '') {
      query.search = search;
    }
    if (filter.has_description !== filter.no_description) {
      if (filter.has_description === 'true') {
        query.has_description = filter.has_description;
      }
      if (filter.no_description === 'true') {
        query.no_description = filter.no_description;
      }
    }
    if (filter.created !== '') {
      query.created = filter.created;
    }
    if (filter.updated !== '') {
      query.updated = filter.updated;
    }
    return query;
  };

  useEffect(() => {
    setLoading(true);
    const query = getQueryObject();
    setSearchParams(query);
    if (!('sort' in query)) query.sort = sortValuesList[0];
    getAndSetProjects(query);
    scrollTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sort, search, filter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const handleApplyFilter = () => {
    const formFilter = document.querySelector('[name="form-filter"]');
    setCurrentPage(1);
    setFilter({
      has_description: formFilter.has_description.checked.toString(),
      no_description: formFilter.no_description.checked.toString(),
      created: formFilter.created_to.value
        ? formFilter.created_from.value + ',' + formFilter.created_to.value
        : formFilter.created_from.value,
      updated: formFilter.updated_to.value
        ? formFilter.updated_from.value + ',' + formFilter.updated_to.value
        : formFilter.updated_from.value
    });
    CloseFilter();
  };

  const onDeleteProject = (index) => {
    setProjects((prevProjectsArray) =>
      prevProjectsArray.filter((project, i) => {
        return i !== index;
      })
    );
  };

  return (
    <>
      <Header
        buttons={
          <Button link="create-project" color="blue">
            Create project
          </Button>
        }
      />
      <main className="flex-1 flex flex-col">
        <div className="row-setting">
          <Container>
            <div className="flex items-end flex-col gap-[15px]">
              <div className="w-full flex justify-between items-center flex-nowrap max-[430px]:flex-col gap-[15px]">
                <input
                  type="text"
                  placeholder="Search"
                  name="search"
                  onChange={handleSearch}
                  value={search}
                  className="max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] text-base font-normal text-gray-900 placeholder:text-gray-500 leading-tight"
                />
                <select
                  name="sort"
                  onChange={handleSort}
                  value={sort}
                  className="max-w-[200px] cursor-pointer max-[430px]:max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] 
                text-base font-normal text-gray-900"
                >
                  <option value="newest">Newest to oldest</option>
                  <option value="oldest">Oldest to newest</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="reverseAlphabetical">Reverse alphabetical</option>
                </select>
              </div>
              <Button onClick={OpenFilter} className="btn-filter">
                Filter
              </Button>

              <FilterWindow handleApplyFilter={handleApplyFilter}>
                <Checkbox
                  label="Has description"
                  name="has_description"
                  checked={filter.has_description === 'true'}
                />
                <Checkbox
                  label="No description"
                  name="no_description"
                  checked={filter.no_description === 'true'}
                />
                <div className="w-full mt-4 text-gray-900 text-base font-bold leading-tight">
                  Created Date
                </div>
                <div className="flex gap-4">
                  <Input
                    label="From"
                    type="date"
                    name="created_from"
                    inputValue={filter.created.split(',')[0]}
                  />
                  <Input
                    label="To"
                    type="date"
                    name="created_to"
                    inputValue={filter.created.split(',')[1]}
                  />
                </div>
                <div className="w-full mt-4 text-gray-900 text-base font-bold leading-tight">
                  Updated Date
                </div>
                <div className="flex gap-4">
                  <Input
                    label="From"
                    type="date"
                    name="updated_from"
                    inputValue={filter.updated.split(',')[0]}
                  />
                  <Input
                    label="To"
                    type="date"
                    name="updated_to"
                    inputValue={filter.updated.split(',')[1]}
                  />
                </div>
              </FilterWindow>
            </div>
          </Container>
        </div>

        <div className="section flex-1 flex flex-col">
          <Container className="flex-1 flex flex-col">
            <Loading loading={loading} />
            {projects.length === 0 ? (
              <div className="w-full flex justify-center mx-auto my-3 text-2xl text-gray-500">
                The list of projects is empty
              </div>
            ) : (
              <>
                <div className="flex-1">
                  {projects.map((project, index) => {
                    return (
                      <ProjectItem
                        key={project?.slug}
                        project={project}
                        onDelete={() => {
                          onDeleteProject(index);
                        }}
                      />
                    );
                  })}
                </div>
                <div className="w-full flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    pagesCount={pagesCount}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </>
            )}
          </Container>
        </div>
      </main>
    </>
  );
}

export default Home;
