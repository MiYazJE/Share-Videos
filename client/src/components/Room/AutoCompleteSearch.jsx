import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import styled from 'styled-components';

import useDebounce from 'src/hooks/useDebounce';

const WrapAutocomplete = styled(HStack)`
  position: relative;
  z-index: 100;
`;

const StyledList = styled(List)`
  position: absolute;
  bottom: -310px;
  left: -8px;
  border-radius: 0.375rem;
  border: 1px solid #E2E8F0;
  width: 100%;
  background-color: #fff;
  max-height: 300px;
  height: 300px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledItem = styled(ListItem)`
  padding: .5em;
  width: 100%;
  cursor: pointer;
  
  &:hover {
    background-color: #E2E8F0;
  }
`;

const readSelector = ({ room, loading }) => ({
  suggestedVideos: room.suggestedVideos,
  loadingVideos: loading.effects.getVideos,
  videos: room.videos,
  search: room.videoSearch,
});

function AutoCompleteSearch({ title, onSearch, resetPagination }) {
  const [showList, setShowList] = useState(false);
  const { suggestedVideos, search } = useSelector(readSelector);
  const dispatch = useDispatch();

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch.room.getSuggestedVideos(debouncedSearch);
    resetPagination();
  }, [debouncedSearch, dispatch, resetPagination]);

  const handleOnChangeInput = (event) => {
    const videoSearch = event.target.value;
    dispatch.room.SET_PROP({ videoSearch });
  };

  const handleOnKeyDown = (event) => {
    if (event.key === 'Enter' && search) {
      onSearch();
      setShowList(false);
    }
  };

  const handleOnClickItem = (e, videoSearch) => {
    e.stopPropagation();
    dispatch.room.SET_PROP({ videoSearch });
    dispatch.room.getVideos();
    setShowList(false);
  };

  return (
    <WrapAutocomplete width="100%">
      <FormControl>
        <FormLabel htmlFor="searchVideo">{title}</FormLabel>
        <Input
          onKeyDown={handleOnKeyDown}
          placeholder="Search a video..."
          id="searchVideo"
          size="lg"
          onClick={() => setShowList(true)}
          onChange={handleOnChangeInput}
          value={search}
        />
      </FormControl>
      {showList ? (
        <StyledList>
          {suggestedVideos.map((videoSuggestion) => (
            <StyledItem
              key={videoSuggestion}
              onClick={(e) => handleOnClickItem(e, videoSuggestion)}
            >
              {videoSuggestion}
            </StyledItem>
          ))}
          {!suggestedVideos.length ? (
            <VStack height="100%" justifyContent="center">
              <Text fontWeight="bold" textAlign="center">No results found</Text>
            </VStack>
          ) : null}
        </StyledList>
      ) : null}
    </WrapAutocomplete>
  );
}

export default AutoCompleteSearch;
