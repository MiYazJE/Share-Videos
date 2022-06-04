import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';

import ResultVideos from 'src/components/ResultVideos';
import AutoCompleteSearch from './AutoCompleteSearch';

const scrollBarStyles = {
  '&::-webkit-scrollbar': {
    width: '6px',
    background: '#cdd1d6',
  },
  '&::-webkit-scrollbar-track': {
    width: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#748ae9',
    borderRadius: '24px',
  },
};

function SearchVideoModal({
  isOpen,
  onClose,
  size,
  title,
}) {
  const scrollRef = useRef();

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <AutoCompleteSearch title={title} />
        </DrawerHeader>
        <DrawerBody ref={scrollRef} css={scrollBarStyles}>
          <ResultVideos ref={scrollRef} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchVideoModal;
