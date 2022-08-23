import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import ResultVideos from 'src/components/ResultVideos';
import usePagination from 'src/hooks/usePagination';
import AutoCompleteSearch from './AutoCompleteSearch';

function SearchVideoModal({
  isOpen,
  onClose,
  size,
  title,
}) {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const {
    getNextPage,
    getPreviousPage,
    resetPagination,
    page,
    loading: loadingWithPagination,
  } = usePagination({
    onSearch: dispatch.room.getVideos,
  });

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <AutoCompleteSearch
            title={title}
            onSearch={getNextPage}
            resetPagination={resetPagination}
          />
        </DrawerHeader>
        <DrawerBody ref={scrollRef}>
          <ResultVideos
            ref={scrollRef}
            getNextPage={getNextPage}
            getPreviousPage={getPreviousPage}
            loadingWithPagination={loadingWithPagination}
            page={page}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchVideoModal;
