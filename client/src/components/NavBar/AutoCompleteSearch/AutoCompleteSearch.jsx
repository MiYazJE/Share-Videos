import { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

const readSelector = ({ room, loading }) => ({
  videosSuggested: room.suggestedVideos,
  loadingVideos: loading.effects.getVideos,
  videos: room.videos,
});

function AutoCompleteSearch() {
  const [search, setSearch] = useState('');

  const { videosSuggested } = useSelector(readSelector);
  const dispatch = useDispatch();

  const handleGetVideos = () => {
    if (!search) return;
    dispatch.room.getVideos(search);
  };

  const handleOnKeyPress = ({ key }) => {
    if (key === 'Enter') handleGetVideos();
  };

  const handleOnChangeAutoComplete = (_, search) => {
    if (!search) return;
    dispatch.room.getVideos(search);
  };

  const handleOnChangeInput = ({ target }) => {
    setSearch(target.value);
    dispatch.room.getSuggestedVideos(target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Autocomplete
        style={{ padding: '', display: 'flex' }}
        onKeyPress={handleOnKeyPress}
        onChange={handleOnChangeAutoComplete}
        options={videosSuggested}
        noOptionsText="No results"
        value={search}
        inputProps={{ 'aria-label': 'search' }}
        renderInput={(params) => (
          <InputBase
            {...params}
            style={{ color: 'white' }}
            ref={params.InputProps.ref}
            onChange={handleOnChangeInput}
            id="search"
            placeholder="Search a video..."
          />
        )}
      />
      <SearchIcon style={{ cursor: 'pointer' }} onClick={handleGetVideos} />
    </div>
  );
}

export default AutoCompleteSearch;
