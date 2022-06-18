import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import PeopleConnected from 'src/components/PeopleConnected';

function SearchVideoModal({
  isOpen,
  onClose,
  size,
  title,
}) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {title}
        </DrawerHeader>
        <DrawerBody>
          <PeopleConnected />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchVideoModal;
