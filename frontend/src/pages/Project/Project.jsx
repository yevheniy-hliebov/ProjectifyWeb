import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  changeProjectCover,
  deleteProject,
  deleteProjectCover,
  getProject,
  getProjectCover,
  uploadProjectCover
} from '../../api/projects';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import Container from '../../components/Container';
import { formatDate } from '../../modules/format-date';
import Loading from '../../components/Loading';
import Input, { Checkbox } from '../../components/form-components/Input';
import FilterWindow, { CloseFilter, OpenFilter } from '../../components/FilterWindow';
import { deleteTask, getTasks } from '../../api/tasks';
import scrollTop from '../../modules/scroll-top';
import TableTasks from '../../components/TableTasks';
import Pagination from '../../components/Pagination';
import Select from '../../components/form-components/Select';
import useNotification from '../../hook/useNotification';

const sortValuesList = ['newest', 'oldest', 'alphabetical', 'reverseAlphabetical'];
const queryList = [
  'page',
  'sort',
  'search',
  'has_description',
  'no_description',
  'status',
  'priority',
  'deadline',
  'created',
  'updated'
];
const valueTrue = ['', 'true'];

function Project() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addNotification } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  let queryParams = {};
  queryList.forEach((queryKey) => {
    queryParams[queryKey] = searchParams.get(queryKey);
  });

  const [project, setProject] = useState(null);
  const [projectCoverUrl, setProjectCoverUrl] = useState(null);
  const [loadingProject, setLoadingProjects] = useState(true);

  const [currentPage, setCurrentPage] = useState(
    queryParams.page && !isNaN(queryParams.page) && Number(queryParams.page) > 0
      ? Number(queryParams.page)
      : 1
  );
  const [pagesCount, setPagesCount] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [sort, setSort] = useState(
    sortValuesList.includes(queryParams.sort) ? queryParams.sort : sortValuesList[0]
  );
  const [search, setSearch] = useState(queryParams.search ? queryParams.search : '');

  const [filter, setFilter] = useState({
    has_description: valueTrue.includes(queryParams.has_description).toString(),
    no_description: valueTrue.includes(queryParams.no_description).toString(),
    status: queryParams.status ? queryParams.status : '',
    priority: queryParams.priority ? queryParams.priority : '',
    deadline: queryParams.deadline ? queryParams.deadline : '',
    created: queryParams.created ? queryParams.created : '',
    updated: queryParams.updated ? queryParams.updated : ''
  });

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
    if (filter.status !== '') {
      query.status = filter.status;
    }
    if (filter.priority !== '') {
      query.priority = filter.priority;
    }
    if (filter.deadline !== '') {
      query.deadline = filter.deadline;
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
    getProject(slug).then((res) => {
      if (res?.status === 200) {
        setProject(res.data);
        setLoadingProjects(false);
      } else if (res?.status === 401) {
        navigate('/login');
      } else if (res?.status === 404) {
        navigate('/404');
      } else if (res?.status === 500 || !res) {
        navigate('/500');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!loadingProject) {
      getProjectCover(slug).then((res) => {
        if (res?.status === 200) {
          const url = URL.createObjectURL(res.data);
          setProjectCoverUrl(url);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProject]);

  useEffect(() => {
    if (!loadingProject) {
      setLoadingTasks(true);
      const query = getQueryObject();
      setSearchParams(query);
      if (!('sort' in query)) query.sort = sortValuesList[0];
      getTasks(slug, query).then((res) => {
        if (res?.status === 200) {
          setTasks(res.data.tasks);
          setPagesCount(res.data.pages_count);
        }
        setLoadingTasks(false);
      });
      scrollTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProject, currentPage, sort, search, filter]);

  const handleDeleteProject = () => {
    deleteProject(slug).then((res) => {
      if (res?.status === 204) {
        addNotification(`Project "${project.name}" was successfully deleted.`, 204);
        navigate('/');
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleApplyFilter = () => {
    const formFilter = document.querySelector('[name="form-filter"]');
    setCurrentPage(1);
    console.log(formFilter);
    setFilter({
      has_description: formFilter.has_description.checked.toString(),
      no_description: formFilter.no_description.checked.toString(),
      status: formFilter.status.value,
      priority: formFilter.priority.value,
      deadline: formFilter.end_date.value
        ? formFilter.start_date.value + ',' + formFilter.end_date.value
        : formFilter.start_date.value,
      created: formFilter.created_to.value
        ? formFilter.created_from.value + ',' + formFilter.created_to.value
        : formFilter.created_from.value,
      updated: formFilter.updated_to.value
        ? formFilter.updated_from.value + ',' + formFilter.updated_to.value
        : formFilter.updated_from.value
    });
    CloseFilter();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const handleDeleteTask = (task, index) => {
    deleteTask(slug, task.number).then((res) => {
      if (res?.status === 204) {
        setTasks((prevTasksArray) =>
          prevTasksArray.filter((task, i) => {
            return i !== index;
          })
        );
        addNotification(`Task "${task.name}" was successfully deleted.`, 204);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleUploadCover = (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('cover-image', file);
    uploadProjectCover(slug, formData).then((res) => {
      if (res?.status === 201) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setProjectCoverUrl(event.target.result);
        };
        fileReader.readAsDataURL(file);
        addNotification(`Cover for project "${project.name}" was successfully uploaded.`, 201);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleChangeCover = (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('cover-image', file);
    changeProjectCover(slug, formData).then((res) => {
      if (res?.status === 200) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setProjectCoverUrl(event.target.result);
        };
        fileReader.readAsDataURL(file);
        addNotification(`Cover for project "${project.name}" was successfully changed.`, 201);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleDeleteCover = (e) => {
    deleteProjectCover(slug).then((res) => {
      if (res?.status === 204) {
        setProjectCoverUrl(null);
        addNotification(`Cover for project "${project.name}" was successfully deleted.`, 204);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      {projectCoverUrl ? (
        <div className="w-full h-44 group relative max-lg:h-32 max-md:h-24 max-sm:h-16 object-cover">
          <img
            className="w-full h-full object-cover pointer-events-none"
            src={projectCoverUrl}
            alt="cover"
          />

          <div className="absolute w-full bottom-0 right-0 group-hover:opacity-100 opacity-0 transition-all">
            <Container className="flex gap-1 justify-end">
              <div className="scale-75 flex gap-2">
                <Button
                  color="blue"
                  type="file"
                  name="cover-image"
                  accept={'image/png, image/jpeg, image/gif, image/bmp, image/svg+xml, image/webp'}
                  onChange={handleChangeCover}
                >
                  Change
                </Button>
                <Button color="red" onClick={handleDeleteCover}>
                  Delete
                </Button>
              </div>
            </Container>
          </div>
        </div>
      ) : null}
      <Header
        title="Read project"
        buttons={
          <>
            {!projectCoverUrl && !loadingProject ? (
              <Button
                color="blue"
                type="file"
                name="cover-image"
                accept={'image/png, image/jpeg, image/gif, image/bmp, image/svg+xml, image/webp'}
                onChange={handleUploadCover}
              >
                Upload cover
              </Button>
            ) : null}
            <Button link="/">Home</Button>
          </>
        }
      />
      <div className="main">
        <div className="sectio-project">
          <Container>
            <Loading loading={loadingProject} />
            {!loadingProject ? (
              <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start gap-5 inline-flex">
                <h2 className="self-stretch text-gray-900 text-[32px] max-sm:text-[20px] font-bold leading-9">
                  {project.name}
                </h2>
                {project.description ? (
                  <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">
                      Description:
                    </div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {project.description}
                    </div>
                  </div>
                ) : null}
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Created:</div>
                  <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">
                    {formatDate(project.createdAt, 'yyyy-MM-dd (HH:mm) ')}
                  </div>
                </div>
                {project.createdAt === project.updatedAt ? null : (
                  <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">Updated:</div>
                    <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">
                      {formatDate(project.updatedAt, 'yyyy-MM-dd (HH:mm) ')}
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-between">
                  <Button link={`/projects/${project.slug}/add-task`} color="blue">
                    Add task
                  </Button>

                  <div className="flex items-center gap-[10px]">
                    <Button link={`/projects/${project.slug}/edit`} color="gray">
                      Edit
                    </Button>
                    <Button color="red" onClick={handleDeleteProject}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </Container>
        </div>

        <div className="section-tasks">
          <div className="row-setting">
            <Container>
              <div className="flex px-[15px] items-end flex-col gap-[15px]">
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
                    className="max-w-[200px] cursor-pointer max-[430px]:max-w-[400px] w-full p-[10px] border border-gray-500 focus:outline-blue-400 rounded-[3px] text-base font-normal text-gray-900"
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

                  <Select
                    label="Status"
                    inputValue={filter.status}
                    placeholder="--Choose an option--"
                    listOptions={['Not started', 'In progress', 'Done']}
                    name="status"
                  />
                  <Select
                    label="Priority"
                    inputValue={filter.priority}
                    placeholder="--Choose an option--"
                    listOptions={['Low', 'Medium', 'High']}
                    name="priority"
                  />

                  <div className="flex gap-4 mt-4">
                    <Input
                      label="Start Date"
                      type="date"
                      name="start_date"
                      inputValue={filter.deadline.split(',')[0]}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      name="end_date"
                      inputValue={filter.deadline.split(',')[1]}
                    />
                  </div>
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
          <Loading loading={loadingTasks} />
          {!loadingTasks && tasks.length > 0 ? (
            <Container>
              <TableTasks projectSlug={slug} tasks={tasks} handleDeleteTask={handleDeleteTask} />
              <Pagination
                currentPage={currentPage}
                pagesCount={pagesCount}
                setCurrentPage={setCurrentPage}
              />
            </Container>
          ) : (
            <div className="w-full px-[15px] flex justify-center mx-auto my-3 text-2xl text-gray-500">
              The list of tasks is empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
