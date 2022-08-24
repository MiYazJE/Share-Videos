import { Button } from '@chakra-ui/react';
import { BsMusicNoteList } from 'react-icons/bs';

function PlayButton({
  onClick,
  isPlaying,
  variant = 'solid',
  isPlayingText = 'Playing',
  ...props
}) {
  return (
    <Button
      variant={variant}
      rightIcon={isPlaying ? null : <BsMusicNoteList />}
      colorScheme={isPlaying ? 'green' : 'facebook'}
      onClick={onClick}
      {...props}
    >
      {isPlaying ? isPlayingText : 'Play'}
    </Button>
  );
}

export default PlayButton;
