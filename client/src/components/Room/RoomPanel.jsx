import {
  Box,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

const RoomPanel = forwardRef(({
  children,
  eyebrow,
  id,
  title,
  contentProps = {},
  ...props
}, ref) => {
  const background = useColorModeValue('rgba(255, 255, 255, 0.88)', 'rgba(17, 24, 39, 0.86)');
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const eyebrowColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <VStack
      as="section"
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      align="stretch"
      spacing={0}
      minW={0}
      overflow="hidden"
      background={background}
      border="1px solid"
      borderColor={borderColor}
      borderRadius={{ base: 'xl', md: '2xl' }}
      boxShadow="0 18px 55px rgba(15, 23, 42, 0.10)"
      backdropFilter="blur(18px)"
      scrollMarginTop={4}
      {...props}
    >
      <HStack px={{ base: 4, md: 5 }} py={4} justify="space-between" align="end">
        <Box>
          {eyebrow ? (
            <Text
              color={eyebrowColor}
              fontSize="xs"
              fontWeight="800"
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {eyebrow}
            </Text>
          ) : null}
          <Text id={`${id}-title`} as="h2" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="800">
            {title}
          </Text>
        </Box>
      </HStack>
      <Box px={{ base: 4, md: 5 }} pb={{ base: 4, md: 5 }} minH={0} {...contentProps}>
        {children}
      </Box>
    </VStack>
  );
});

RoomPanel.displayName = 'RoomPanel';

export default RoomPanel;
