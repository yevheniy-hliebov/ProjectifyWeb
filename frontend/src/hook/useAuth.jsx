import { useEffect, useState } from 'react';
import { getAuthUser } from '../api/auth';

function useAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAuthUser().then((res) => {
      if (res) {
        if (res.status === 200) {
          setAuthUser(res.data);
        } else {
          setIsLoading(false);
        }
      }
    });
  }, []);

  return { authUser, setAuthUser, isLoading };
}

export default useAuth;
