import { useEffect, useState } from "react";

function useDebouncedQuery(query, delay = 600) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, query]);

  return debouncedQuery;
}

export default useDebouncedQuery;
