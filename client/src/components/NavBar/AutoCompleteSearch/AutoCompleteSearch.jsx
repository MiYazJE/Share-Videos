import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@material-ui/core';
import { connect } from 'react-redux';
import { getVideos, getSuggestedVideos } from '../../../actions/roomActions';
import { readVideos, readSuggestedVideos, readLoadingVideos } from '../../../reducers/roomReducer';

function AutoCompleteSearch({
  getVideos,
  videosSuggested,
  getSuggestedVideos,
}) {
  const [search, setSearch] = useState('');

  const handleGetVideos = () => {
    if (!search) return;
    // scrollTo();
    getVideos(search);
  };

  const handleOnKeyPress = ({ key }) => {
    if (key === 'Enter') handleGetVideos();
  };

  const handleOnChangeAutoComplete = (_, search) => {
    if (!search) return;
    getVideos(search);
  };

  const handleOnChangeInput = ({ target }) => {
    setSearch(target.value);
    getSuggestedVideos(target.value);
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

const mapStateToProps = (state) => ({
  videosSuggested: readSuggestedVideos(state),
  videos: readVideos(state),
  loadingVideos: readLoadingVideos(state),
});

const mapDispatchToProps = (dispatch) => ({
  getVideos: (query) => dispatch(getVideos(query)),
  getSuggestedVideos: (query) => dispatch(getSuggestedVideos(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteSearch);
