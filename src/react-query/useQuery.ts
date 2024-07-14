import {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import { QueryClientContext } from './QueryClientProvider';

const createQueryObserver = (
  queryClient,
  { queryKey, queryFn, staleTime = 0 }
) => {
  const query = queryClient.getQuery({
    queryKey,
    queryFn,
  });

  const observer = {
    notify: () => {},
    subscribe: (rerender) => {
      const unsubscribe =
        query.subscribe(observer);
      observer.notify = rerender;
      if (
        !query.state.lastUpdated ||
        Date.now() - query.state.lastUpdated >
          staleTime
      ) {
        query.fetch();
      }
      return unsubscribe;
    },
    getQueryState: () => query.state,
  };

  return observer;
};

export const useQuery = ({
  queryKey,
  queryFn,
  staleTime,
}) => {
  const queryClient = useContext(
    QueryClientContext
  );

  const observer = useRef(
    createQueryObserver(queryClient, {
      queryKey,
      queryFn,
      staleTime,
    })
  );

  const [, setCount] = useState(0);
  const rerender = () => setCount((c) => c + 1);

  useEffect(() => {
    return observer.current.subscribe(rerender);
  }, []);

  return observer.current.getQueryState();
};
