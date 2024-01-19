import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/section-components/Header';
import Button from '../../components/form-components/Button';
import FormProject from '../../components/form-components/FormProject';
import { getProject } from '../../api/projects';
import Loading from '../../components/Loading';

function EditProject() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    getProject(slug).then((res) => {
      if (res?.status === 200) {
        const { name, description } = res?.data;
        setProjectData({ name, description });
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

  return (
    <div className="wrapper w-full min-h-screen bg-gray-50">
      <Header title="Edit project" buttons={<Button link="/">Home</Button>} />
      <div className="section">
        <Loading loading={loading} />
        {!loading ? (
          <FormProject projectData={projectData} isEditProject={true} oldSlug={slug} />
        ) : null}
      </div>
    </div>
  );
}

export default EditProject;
