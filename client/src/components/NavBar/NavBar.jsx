import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Link, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { styled } from '@material-ui/core';
import styledComponents from 'styled-components';

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

const StyledLink = styledComponents(Link)`
  color: white;
  font-size: 30px;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

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
      <StyledLink to="/">
        Share Videos
      </StyledLink>
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
