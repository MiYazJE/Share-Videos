import styled from 'styled-components';
import { Box } from '@chakra-ui/react';

export const RoomCanvas = styled(Box)`
  min-height: 100vh;
  isolation: isolate;

  &::before {
    position: fixed;
    z-index: -1;
    inset: 0;
    content: '';
    pointer-events: none;
    background:
      radial-gradient(circle at 10% 5%, rgba(49, 130, 206, 0.16), transparent 28rem),
      radial-gradient(circle at 88% 25%, rgba(56, 178, 172, 0.10), transparent 24rem);
  }
`;

export const WrapPlayer = styled(Box)`
  overflow: hidden;
  background: #05070a;
  border-radius: 1rem;
  box-shadow: 0 24px 70px rgba(3, 7, 18, 0.28);

  & iframe {
    border-radius: 1rem;
  }
`;
