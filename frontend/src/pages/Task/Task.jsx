import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import Container from '../../components/Container';
import { formatDate } from '../../modules/format-date';
import Loading from '../../components/Loading';
import {
  changeTaskCover,
  deleteTask,
  deleteTaskCover,
  getTask,
  getTaskCover,
  uploadTaskCover
} from '../../api/tasks';
import useNotification from '../../hook/useNotification';

function Task() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { slug, number } = useParams();

  const [task, setTask] = useState(null);
  const [taskCoverUrl, setTaskCoverUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTask(slug, number).then((res) => {
      if (res?.status === 200) {
        setTask(res.data);
        setLoading(false);
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
    if (!loading) {
      getTaskCover(slug, number).then((res) => {
        if (res?.status === 200) {
          const url = URL.createObjectURL(res.data);
          setTaskCoverUrl(url);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleDeleteTask = () => {
    deleteTask(slug, number).then((res) => {
      if (res?.status === 204) {
        addNotification(`Task "${task.name}" was successfully deleted.`, 204);
        navigate('/projects/' + slug);
      } else if (res?.status === 404) {
        addNotification(res.data.message, res.data.statusCode);
      } else if (res?.status === 500) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleUploadCover = (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('cover-image', file);
    uploadTaskCover(slug, number, formData).then((res) => {
      if (res?.status === 201) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setTaskCoverUrl(event.target.result);
        };
        fileReader.readAsDataURL(file);
        addNotification(`Cover for task "${task.name}" was successfully uploaded.`, 201);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleChangeCover = (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('cover-image', file);
    changeTaskCover(slug, number, formData).then((res) => {
      if (res?.status === 200) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setTaskCoverUrl(event.target.result);
        };
        fileReader.readAsDataURL(file);
        addNotification(`Cover for task "${task.name}" was successfully changed.`, 201);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  const handleDeleteCover = (e) => {
    deleteTaskCover(slug, number).then((res) => {
      if (res?.status === 204) {
        setTaskCoverUrl(null);
        addNotification(`Cover for task "${task.name}" was successfully deleted.`, 204);
      } else if (res?.status) {
        addNotification(res.data.message, res.data.statusCode);
      }
    });
  };

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      {taskCoverUrl ? (
        <div className="w-full h-44 group relative max-lg:h-32 max-md:h-24 max-sm:h-16 object-cover">
          <img
            className="w-full h-full object-cover pointer-events-none"
            src={taskCoverUrl}
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
        title="Read task"
        buttons={
          <>
            {!taskCoverUrl && !loading ? (
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
            <Button link={`/projects/${slug}`}>Back to project</Button>
          </>
        }
      />
      <div className="main">
        <div className="sectio-project">
          <Container>
            <Loading loading={loading} />
            {!loading ? (
              <div className="w-full p-[15px] max-sm:px-0 flex-col justify-start gap-5 inline-flex">
                <h2 className="self-stretch text-gray-900 text-[32px] max-sm:text-[20px] font-bold leading-9">
                  {task.name}
                </h2>
                {task.description ? (
                  <div className="self-stretch flex-col justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">
                      Description:
                    </div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {task.description}
                    </div>
                  </div>
                ) : null}
                {task.status ? (
                  <div className="self-stretch justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">Status:</div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {task.status}
                    </div>
                  </div>
                ) : null}
                {task.priority ? (
                  <div className="self-stretch justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">Priority:</div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {task.priority}
                    </div>
                  </div>
                ) : null}
                {task.start_date ? (
                  <div className="self-stretch justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">
                      Start date:
                    </div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {task.start_date}
                    </div>
                  </div>
                ) : null}
                {task.end_date ? (
                  <div className="self-stretch justify-start items-start gap-2.5 flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">End date:</div>
                    <div className="self-stretch text-justify text-gray-900 text-base font-normal leading-tight">
                      {task.end_date}
                    </div>
                  </div>
                ) : null}
                <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                  <div className="text-gray-900 text-base font-bold leading-tight">Created:</div>
                  <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">
                    {formatDate(task.createdAt, 'yyyy-MM-dd (HH:mm) ')}
                  </div>
                </div>
                {task.createdAt === task.updatedAt ? null : (
                  <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                    <div className="text-gray-900 text-base font-bold leading-tight">Updated:</div>
                    <div className="grow shrink basis-0 text-gray-900 text-base font-normal leading-tight">
                      {formatDate(task.updatedAt, 'yyyy-MM-dd (HH:mm) ')}
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-end">
                  <div className="flex items-center gap-[10px]">
                    <Button link={`/projects/${slug}/tasks/${number}/edit`} color="gray">
                      Edit
                    </Button>
                    <Button color="red" onClick={handleDeleteTask}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Task;
