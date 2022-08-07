import { useEffect, useState } from 'react';

// Hook from https://usehooks.com/useDebounce

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay],
  );
  return debouncedValue;
}

export default useDebounce;
