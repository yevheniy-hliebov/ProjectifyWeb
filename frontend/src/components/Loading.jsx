import loadingSvg from '../loading.svg';

function Loading({ loading }) {
  if (!loading) return null;
  return (
    <div className="image mx-auto my-3 text-2xl size-28">
      <img src={loadingSvg} alt="loading" />
    </div>
  );
}

export default Loading;
