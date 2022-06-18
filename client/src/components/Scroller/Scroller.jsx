import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IconButton } from '@chakra-ui/react';
import { MdArrowUpward } from 'react-icons/md';

const Scroller = forwardRef((_, ref) => {
  const [show, setShow] = useState(false);

  const toggleShow = useCallback(() => {
    setShow(ref.current.scrollTop >= 300);
  }, [ref]);

  useEffect(() => {
    const { current } = ref;
    current.addEventListener('scroll', toggleShow);
    return () => current.removeEventListener('scroll', toggleShow);
  }, [ref, toggleShow]);

  return (
    show ? (
      <IconButton
        colorScheme="facebook"
        position="fixed"
        bottom={1}
        right={3}
        onClick={() => ref.current?.scrollTo?.({
          top: 0,
          behavior: 'smooth',
        })}
        icon={<MdArrowUpward size={25} />}
      />
    ) : null
  );
});

export default Scroller;
