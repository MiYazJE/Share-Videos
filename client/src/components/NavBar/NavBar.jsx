import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { styled } from '@material-ui/core';
import styledComponents from 'styled-components';

import { HStack } from '@chakra-ui/react';
import AutoCompleteSearch from '../Room/AutoCompleteSearch';
import AuthenticationNav from './AuthenticationNav/AuthenticationNav';

const StyledWrapAutoComplete = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(252, 252, 252, 0.15)',
  borderRadius: '3px',
  padding: '10px',
});

const StyledLink = styledComponents(Link)`
  color: #385898;
  font-weight: bold;
  font-size: 30px;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

const readSelectors = ({ loading }) => ({
  loadingVideos: loading.effects.room.getVideos,
});

function NavBar({ openLogin, openRegister }) {
  const history = useHistory();
  const { loadingVideos } = useSelector(readSelectors);
  const [showSearchBar] = useState(history.location.pathname !== '/');

  return (
    <HStack width="100%" p={3} position="sticky" justifyContent="space-between">
      <StyledLink to="/">
        Share Videos
      </StyledLink>
      {showSearchBar ? (
        <StyledWrapAutoComplete>
          <AutoCompleteSearch />
          {loadingVideos ? <CircularProgress style={{ marginLeft: '30px', color: 'white' }} size={30} /> : null}
        </StyledWrapAutoComplete>
      ) : <AuthenticationNav openLogin={openLogin} openRegister={openRegister} />}
    </HStack>
  );
}

export default NavBar;
