import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import Chat from 'src/components/Chat';

function ChatModal({
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
        <DrawerBody pb={0}>
          <Chat />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default ChatModal;
