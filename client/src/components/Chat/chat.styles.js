import styled from 'styled-components';

const WrapChat = styled.div`
  height: 100%;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 8px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatText = styled.div`
  display: flex;
  justify-content: ${({ me }) => (me ? 'end' : 'start')};
`;

export {
  WrapChat,
  ChatText,
};
