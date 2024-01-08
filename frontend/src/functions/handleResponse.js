/**
 * Handles the response from an API call and performs appropriate actions based on the response status.
 *
 * @param {any} response - Response object or string ('Unauthorized' or undefined).
 * @param {Function} navigate - Function to navigate to different routes.
 * @param {Function} handleOk - Function to handle successful response (status 200 or 201).
 * @param {Function} handleBad - Function to handle bad request (status 400).
 * @param {Function} handleNotFound - Function to handle not found request (status 404).
 * @param {Function} handleDelete - Function to handle successful deletion (status 204).
 */
export function handleResponse(response, navigate, handleOk, handleBad, handleNotFound, handleDelete) {
  if (response === "Unauthorized") {
    navigate('/login');
  } else if (response === undefined) {
    navigate('/internal-server-error');
  } else if (response.status === 200 || response.status === 201) {
    handleOk()
  } else if (response.status === 400) {
    handleBad()
  } else if (response.status === 204) {
    handleDelete()
  } else if (response.status === 404) {
    handleNotFound()
  }
}

// function handlePostResponse(response, handleOk, handleNotFound) {
//   const navigate = useNavigate();
//   if (response === "Unauthorized") {
//     navigate('/login');
//   } else if (response === undefined) {
//     navigate('/internal-server-error');
//   } else if (response.status === 200 || response.status === 201) {
//     handleOk()
//   } else if (response.status === 404) {
//     handleNotFound()
//   }
// }