import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { getVideos, getSuggestedVideos } from '../../actions/roomActions';
import { readVideos, readSuggestedVideos, readLoadingVideos } from '../../reducers/roomReducer';
import { InputBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '90%'
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
	  justifyContent: 'center',
	  cursor: 'pointer',
	  zIndex: 100,
	  right: 1,
	  top: 1
    },
    inputInput: {
	  padding: theme.spacing(1, 1, 1, 1),
      paddingLeft: '5px',
      paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
    },
  }));

const NavBar = ({ getVideos, videosSuggested, getSuggestedVideos, loadingVideos, scrollTo }) => {
	const [search, setSearch] = useState('');
	const classes = useStyles();

	const handleGetVideos = () => {
    if (!search) return;
    scrollTo();
		getVideos(search);
	}

  return (
    <AppBar position="sticky" style={{ alignItems: 'center' }}>
      <div className={classes.root}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Video Share
          </Typography>
          <div className={classes.search}>
            <Autocomplete
              onKeyPress={({ key }) => {
                if (key === 'Enter') handleGetVideos()
              }}
              onChange={(_, searched) => {
                if (!searched) return;
                setSearch(searched);
                handleGetVideos();
              }}
              options={videosSuggested}
              noOptionsText="No results"
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
              value={search}
              inputProps={{ 'aria-label': 'search' }}
              renderInput={(params) => (
                <InputBase
                    {...params} 
                    style={{color: 'white'}}
                    ref={params.InputProps.ref}
                    onChange={({ target }) => {
                      setSearch(target.value);
                      getSuggestedVideos(target.value);
                    }}
                    id="search" 
                    placeholder="Search a video..." 
                />
              )}
            />
            <div className={classes.searchIcon}>
              <SearchIcon onClick={handleGetVideos} />
            </div>
          </div>
          {loadingVideos ? <CircularProgress style={{marginLeft: '30px', color: 'white'}} size={30} /> : null}
        </Toolbar>
      </div>
    </AppBar>
  );
}

const mapStateToProps = state => ({
    videosSuggested: readSuggestedVideos(state),
    videos: readVideos(state),
    loadingVideos: readLoadingVideos(state),
});

const mapDispatchToProps = dispatch => ({
    getVideos: (query) => dispatch(getVideos(query)),
    getSuggestedVideos: (query) => dispatch(getSuggestedVideos(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);