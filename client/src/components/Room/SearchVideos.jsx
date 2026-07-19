import { Box } from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import ResultVideos from 'src/components/ResultVideos';
import usePagination from 'src/hooks/usePagination';
import AutoCompleteSearch from './AutoCompleteSearch';

function SearchVideos() {
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
    <>
      <AutoCompleteSearch
        resetPagination={resetPagination}
      />
      <Box
        ref={scrollRef}
        mt={4}
        maxH={{ base: 'none', lg: '34rem' }}
        overflowY={{ base: 'visible', lg: 'auto' }}
        pr={{ base: 0, lg: 2 }}
      >
        <ResultVideos
          ref={scrollRef}
          getNextPage={getNextPage}
          getPreviousPage={getPreviousPage}
          loadingWithPagination={loadingWithPagination}
          page={page}
        />
      </Box>
    </>
  );
}

export default SearchVideos;
