import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { styled } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import AutoCompleteSearch from './AutoCompleteSearch/AutoCompleteSearch';
import AuthenticationNav from './AuthenticationNav/AuthenticationNav';

const StyledAppBar = styled(AppBar)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px 20px',
});

const StyledWrapAutoComplete = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(252, 252, 252, 0.15)',
  borderRadius: '3px',
  padding: '10px',
});

// TODO
const readSelectors = () => ({
  loadingVideos: false,
});

function NavBar({ openLogin, openRegister }) {
  const history = useHistory();
  const { loadingVideos } = useSelector(readSelectors);
  const [showSearchBar] = useState(history.location.pathname !== '/');

  return (
    <StyledAppBar position="sticky">
      <Typography variant="h4" align="center" noWrap>
        Share Videos
      </Typography>
      {showSearchBar ? (
        <StyledWrapAutoComplete>
          <AutoCompleteSearch />
          {loadingVideos ? <CircularProgress style={{ marginLeft: '30px', color: 'white' }} size={30} /> : null}
        </StyledWrapAutoComplete>
      ) : <AuthenticationNav openLogin={openLogin} openRegister={openRegister} />}
    </StyledAppBar>
  );
}

export default NavBar;
