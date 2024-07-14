export const createQuery = ({
  queryKey,
  queryFn,
}) => {
  const query = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
    fetchingFunction: null,
    subscribers: [],
    state: {
      status: 'pending',
      isFetching: true,
      data: undefined,
      error: undefined,
      lastUpdated: undefined,
    },

    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);
      return () => {
        query.subscribers =
          query.subscribers.filter(
            (s) => s !== subscriber
          );
      };
    },

    setState: (updater) => {
      query.state = updater(query.state);
      query.subscribers.forEach((s) =>
        s.notify()
      );
    },

    fetch: async () => {
      if (!query.fetchingFunction) {
        query.fetchingFunction = async () => {
          query.setState((oldState) => {
            return {
              ...oldState,
              isFetching: true,
              error: undefined,
            };
          });

          try {
            const data = await queryFn();
            query.setState((oldState) => {
              return {
                ...oldState,
                status: 'success',
                data,
                lastUpdated: Date.now(),
              };
            });
          } catch (error) {
            query.setState((oldState) => {
              return {
                ...oldState,
                status: 'error',
                error,
              };
            });
          } finally {
            query.fetchingFunction = null;
            query.setState((oldState) => {
              return {
                ...oldState,
                isFetching: false,
              };
            });
          }
        };
        query.fetchingFunction();
      }
    },
  };

  return query;
};
