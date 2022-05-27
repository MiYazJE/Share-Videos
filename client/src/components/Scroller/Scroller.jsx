import { useCallback, useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './scroller.scss';

function Scroller() {
  const [show, setShow] = useState(false);

  const toggleShow = useCallback(() => {
    setShow(window.pageYOffset >= 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', toggleShow);
    return () => window.removeEventListener('scroll', toggleShow);
  }, [toggleShow]);

  return (
    <div
      className="wrapScroller"
      style={{ opacity: show ? 1 : 0 }}
      onClick={
        () => window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    >
      <FaArrowUp className="arrow" size={25} />
    </div>
  );
}

export default Scroller;
