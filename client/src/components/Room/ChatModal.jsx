import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';

import Chat from 'src/components/Chat';

const scrollBarStyles = {
  '&::-webkit-scrollbar': {
    width: '6px',
    background: '#cdd1d6',
  },
  '&::-webkit-scrollbar-track': {
    width: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#748ae9',
    borderRadius: '24px',
  },
};

function ChatModal({
  isOpen,
  onClose,
  size,
  title,
}) {
  const scrollRef = useRef();

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {title}
        </DrawerHeader>
        <DrawerBody pb={0} ref={scrollRef} css={scrollBarStyles}>
          <Chat ref={scrollRef} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default ChatModal;
