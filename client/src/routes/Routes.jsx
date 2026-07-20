import { Switch, Route } from 'react-router-dom';
import { Alert, AlertIcon, Button, Center, Spinner, VStack } from '@chakra-ui/react';

import Home from 'src/pages/Home';
import Room from 'src/pages/Room';
import RoomNotFound from 'src/pages/RoomNotFound';

import { useSession } from 'src/context/SessionContextProvider';

function Routes() {
  const { sessionQuery } = useSession();

  if (sessionQuery.isPending) {
    return <Center minH="100vh"><Spinner size="xl" aria-label="Loading session" /></Center>;
  }

  if (sessionQuery.isError) {
    return (
      <Center minH="100vh">
        <VStack>
          <Alert status="error"><AlertIcon />Unable to load your session.</Alert>
          <Button onClick={() => sessionQuery.refetch()}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <div id="app">
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/room/:id">
          <Room />
        </Route>
        <Route path="/room-not-found/:id">
          <RoomNotFound />
        </Route>
        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default Routes;
