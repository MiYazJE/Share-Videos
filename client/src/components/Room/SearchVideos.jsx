import { Alert, AlertIcon, Box, Button, HStack, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ResultVideos from 'src/components/ResultVideos';
import useDebounce from 'src/hooks/useDebounce';
import { normalizeSearch } from 'src/api/videos';
import { videoSearchOptions, videoSuggestionsOptions } from 'src/queries/videos';
import AutoCompleteSearch from './AutoCompleteSearch';

function SearchVideos() {
  const scrollRef = useRef();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedInput = normalizeSearch(useDebounce(input));
  const normalizedSearch = normalizeSearch(search);
  const offset = (page - 1) * limit;

  const suggestionsQuery = useQuery(videoSuggestionsOptions(debouncedInput));
  const videosQuery = useQuery(videoSearchOptions({
    search: normalizedSearch, limit, offset,
  }));

  const runSearch = (nextSearch = input) => {
    setSearch(nextSearch);
    setPage(1);
  };

  return (
    <>
      <AutoCompleteSearch
        search={input}
        suggestions={suggestionsQuery.data || []}
        suggestionsError={suggestionsQuery.isError}
        onChange={setInput}
        onSearch={runSearch}
      />
      {videosQuery.isError && !videosQuery.data ? (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <HStack justifyContent="space-between" width="100%">
            <Text>Videos could not be loaded.</Text>
            <Button size="sm" onClick={() => videosQuery.refetch()}>Retry</Button>
          </HStack>
        </Alert>
      ) : null}
      <Box
        ref={scrollRef}
        mt={4}
        maxH={{ base: 'none', lg: '34rem' }}
        overflowY={{ base: 'visible', lg: 'auto' }}
        pr={{ base: 0, lg: 2 }}
      >
        <ResultVideos
          ref={scrollRef}
          videos={videosQuery.data?.data || []}
          isLastPage={videosQuery.data?.isLastPage ?? true}
          loading={videosQuery.isLoading}
          hasSearch={Boolean(normalizedSearch)}
          getNextPage={() => setPage((current) => current + 1)}
          getPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          page={page}
        />
      </Box>
    </>
  );
}

export default SearchVideos;
