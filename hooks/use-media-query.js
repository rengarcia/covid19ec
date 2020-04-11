import { useEffect, useState } from "react";

function useMediaQuery(mediaQueryString) {
  const [matches, setMatches] = useState(
    () => process.browser && matchMedia(mediaQueryString).matches
  );

  useEffect(() => {
    const mql = matchMedia(mediaQueryString);
    const listener = (e) => setMatches(e.matches);

    mql.addListener(listener);

    return () => mql.removeListener(listener);
  }, [mediaQueryString]);

  return matches;
}

export default useMediaQuery;
