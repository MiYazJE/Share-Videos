import useVideoMetadata from 'src/hooks/useVideoMetadata';
import { HStack, Text, VStack } from '@chakra-ui/react';

function MetaVideoInfo() {
  const {
    viewsFormatted,
    currentVideo: { views, uploadedAt, title },
  } = useVideoMetadata();

  return (
    <VStack align="flex-start" spacing={1} pt={4} px={{ base: 1, md: 0 }}>
      {title ? (
        <Text as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" letterSpacing="-0.02em">
          {title}
        </Text>
      ) : (
        <Text color="gray.500">Choose a video from search or the shared playlist.</Text>
      )}
      <HStack color="gray.500" fontSize="sm" divider={views && uploadedAt ? <Text>•</Text> : null}>
        {views ? <Text>{viewsFormatted}</Text> : null}
        {uploadedAt ? <Text>{uploadedAt}</Text> : null}
      </HStack>
    </VStack>
  );
}

export default MetaVideoInfo;
