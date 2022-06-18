import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import SharedPlayList from 'src/components/SharedPlaylist';

function SharedPlaylistModal({
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
          <SharedPlayList />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SharedPlaylistModal;
