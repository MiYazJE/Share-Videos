import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthenticationNav from './AuthenticationNav/AuthenticationNav';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AutoCompleteSearch from './AutoCompleteSearch/AutoCompleteSearch';
import { connect } from 'react-redux';
import { readLoadingVideos } from '../../reducers/roomReducer';
import { styled } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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

const NavBar = ({ loadingVideos }) => {
	const history = useHistory();
	const [showSearchBar] = useState(history.location.pathname !== '/');

	return (
		<StyledAppBar position="sticky">
			<Typography variant="h4" align="center" noWrap>
				Share Videos
			</Typography>
			{showSearchBar ? (
				<StyledWrapAutoComplete>
					<AutoCompleteSearch />
					{loadingVideos ? <CircularProgress style={{marginLeft: '30px', color: 'white'}} size={30} /> : null}
				</StyledWrapAutoComplete>
			) : <AuthenticationNav />}
		</StyledAppBar>
	);
}

const mapStateToProps = state => ({
    loadingVideos: readLoadingVideos(state),
});

export default connect(mapStateToProps, null)(NavBar);