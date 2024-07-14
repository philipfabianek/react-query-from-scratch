// import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
import { useQuery } from './react-query';

const fetchData = () => {
  console.log('fetching data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'Title 1',
          description: 'This is post 1',
        },
        {
          name: 'Title 2',
          description: 'This is post 2',
        },
      ]);
    }, 1000);
  });
};

const usePostsQuery = () => {
  return useQuery({
    queryKey: ['postsData'],
    queryFn: fetchData,
    staleTime: 5000,
  });
};

const Posts = ({ title }) => {
  const { status, isFetching, error, data } =
    usePostsQuery();

  if (status === 'pending') return 'Loading...';

  if (error)
    return (
      'An error has occurred: ' + error.message
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>{title}</h1>
      {isFetching && <p>Refetching...</p>}
      {data.map((item) => (
        <div key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [showPosts1, setShowPosts1] =
    useState(true);
  const [showPosts2, setShowPosts2] =
    useState(true);

  return (
    <>
      <button
        onClick={() => setShowPosts1(!showPosts1)}
      >
        Toggle Posts 1
      </button>
      <button
        onClick={() => setShowPosts2(!showPosts2)}
      >
        Toggle Posts 2
      </button>
      <div style={{ display: 'flex' }}>
        {showPosts1 && <Posts title="Posts 1" />}
        {showPosts2 && <Posts title="Posts 2" />}
      </div>
    </>
  );
}

export default App;
