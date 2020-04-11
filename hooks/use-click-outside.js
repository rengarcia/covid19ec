import { useEffect } from "react";

function useClickOutside(ref, callback) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }

      callback(e);
    }

    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, [ref, callback]);
}

export default useClickOutside;
