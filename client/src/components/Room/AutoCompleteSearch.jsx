import { useState } from 'react';
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

function AutoCompleteSearch({
  search,
  suggestions,
  suggestionsError,
  onChange,
  onSearch,
}) {
  const [showList, setShowList] = useState(false);
  const { colorMode } = useColorMode();

  const handleOnChangeInput = (event) => {
    onChange(event.target.value);
  };

  const searchSuggest = (event) => {
    if (event.key !== 'Enter') return;

    onSearch(search);
    setShowList(false);
  };

  const onClickSuggest = (e, videoSearch) => {
    e.stopPropagation();
    onChange(videoSearch);
    onSearch(videoSearch);
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
      {suggestionsError ? <Text color="red.400" fontSize="sm">Suggestions unavailable. You can still search.</Text> : null}
      {(showList && suggestions?.length) ? (
        <StyledList darkMode={colorMode === 'dark'}>
          {suggestions.map((videoSuggestion) => (
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
