import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import FormTask from '../../components/form-components/FormTask';
import { getTask } from '../../api/tasks';
import Loading from '../../components/Loading';

function EditTask() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug, number } = useParams();

  useEffect(() => {
    getTask(slug, number).then((res) => {
      if (res?.status === 200) {
        const { name, description, status, priority, start_date, end_date } = res?.data;
        setTaskData({ name, description, status, priority, start_date, end_date });
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
  }, [slug, number]);

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header title="Edit task" buttons={<Button link="/">Home</Button>} />
      <div className="section">
        <Loading loading={loading} />
        {!loading ? (
          <FormTask taskData={taskData} isEditTask={true} oldSlug={slug} oldNumber={number} />
        ) : null}
      </div>
    </div>
  );
}

export default EditTask;
