import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import styled from 'styled-components';

import useDebounce from 'src/hooks/useDebounce';
import { SearchIcon } from '@chakra-ui/icons';

const WrapAutocomplete = styled(HStack)`
  position: relative;
  z-index: 100;
`;

const StyledList = styled(List)`
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  border-radius: 0.375rem;
  border: 1px solid #E2E8F0;
  width: 100%;
  background-color: ${({ darkMode }) => (darkMode ? '#1A202C' : '#fff')};
  max-height: 300px;
  height: auto;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledItem = styled(ListItem)`
  padding: .5em;
  width: 100%;
  cursor: pointer;
  transition: all .3s;
  
  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#2D3748' : '#E2E8F0')};
  }
`;

const readSelector = ({ room }) => ({
  suggestedVideos: room.suggestedVideos,
  search: room.videoSearch,
});

function AutoCompleteSearch({
  resetPagination,
}) {
  const [showList, setShowList] = useState(false);

  const {
    suggestedVideos,
    search,
  } = useSelector(readSelector);

  const { colorMode } = useColorMode();
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

  const searchSuggest = (event) => {
    if (event.key !== 'Enter') return;

    resetPagination();
    dispatch.room.getVideos();
    setShowList(false);
  };

  const onClickSuggest = (e, videoSearch) => {
    e.stopPropagation();
    dispatch.room.SET_PROP({ videoSearch });
    dispatch.room.getVideos();
    setShowList(false);
  };

  return (
    <WrapAutocomplete width="100%">
      <VStack w="100%" alignItems="left">
        <FormControl>
          <FormLabel htmlFor="searchVideo">
            <Text fontWeight="semibold">Search by title or URL</Text>
          </FormLabel>
          <InputGroup position="relative">
            <InputLeftElement
              mt={5}
              pointerEvents="none"
              /* eslint-disable-next-line */
              children={<SearchIcon w={4} h={4} />}
            />
            <Input
              mt="1em"
              onKeyDown={searchSuggest}
              placeholder="Search a video"
              id="searchVideo"
              size="lg"
              onClick={() => setShowList(true)}
              onChange={handleOnChangeInput}
              value={search}
            />
          </InputGroup>
        </FormControl>
      </VStack>
      {(showList && suggestedVideos?.length) ? (
        <StyledList darkMode={colorMode === 'dark'}>
          {suggestedVideos.map((videoSuggestion) => (
            <StyledItem
              key={videoSuggestion}
              darkMode={colorMode === 'dark'}
              onClick={(e) => onClickSuggest(e, videoSuggestion)}
            >
              {videoSuggestion}
            </StyledItem>
          ))}
        </StyledList>
      ) : null}
    </WrapAutocomplete>
  );
}

export default AutoCompleteSearch;
