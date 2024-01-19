import { createContext, useContext } from 'react';

export const NotificationContext = createContext();

function useNotification() {
  const [notificationsParams, setNotificationsParams] = useContext(NotificationContext);

  const addNotification = (message, status) => {
    const notification = { message, status };
    setNotificationsParams([...notificationsParams, notification]);
  };

  const closeNotification = (index) => {
    setNotificationsParams((prevArray) =>
      prevArray.filter((notification, i) => {
        return i !== index;
      })
    );
  };

  return { notifications: notificationsParams, addNotification, closeNotification };
}

export default useNotification;
