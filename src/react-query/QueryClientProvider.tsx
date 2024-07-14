import { createContext } from 'react';

export const QueryClientContext = createContext();

export const QueryClientProvider = ({
  client,
  children,
}) => {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
};
