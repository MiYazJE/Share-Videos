import { useEffect, useState } from 'react';

const useTextInterval = (initialText = '') => {
  const [updatedText, setUpdatedText] = useState(initialText);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedText((t) => {
        const dots = t.match(/\./g)?.length || 0;
        if (dots === 3) return t.replace(/\./g, '');
        return t.concat('.');
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return updatedText;
};

export default useTextInterval;
