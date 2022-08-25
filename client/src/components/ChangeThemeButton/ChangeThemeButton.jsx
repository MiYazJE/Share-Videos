import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react';

function ChangeThemeButton({ variant, size }) {
  const { toggleColorMode, colorMode } = useColorMode();

  const IconMode = colorMode === 'light' ? MoonIcon : SunIcon;

  return (
    <Tooltip label={`Change to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleColorMode}
        icon={<IconMode size={size} />}
        variant={variant}
      />
    </Tooltip>
  );
}

export default ChangeThemeButton;
