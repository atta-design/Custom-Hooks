import React ,{ useEffect, useRef } from "react";

/**
 * Hook that triggers a callback when clicking outside the target element.
 *
 * @param handler - Function to call on outside click
 * @returns ref - A ref to attach to the element to detect outside clicks
 */
function useClickOutside<T extends HTMLElement>(
  handler: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
