import { createQuery } from './createQuery';

export class QueryClient {
  constructor() {
    this.queries = [];
  }

  getQuery = ({ queryFn, queryKey }) => {
    const queryHash = JSON.stringify(queryKey);

    let query = this.queries.filter(
      (query) => query.queryHash === queryHash
    )[0];

    if (!query) {
      // Create a new query
      query = createQuery({ queryKey, queryFn });
      this.queries.push(query);
    }

    return query;
  };
}
