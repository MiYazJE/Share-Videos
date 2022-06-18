import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Routes from './routes/Routes';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch.user.whoAmI();
  }, [dispatch]);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
