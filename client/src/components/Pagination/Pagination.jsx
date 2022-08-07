import {
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

function Pagination({
  showNextPage = true,
  getNextPage,
  getPreviousPage,
  page,
}) {
  return (
    <HStack>
      <IconButton
        disabled={page === 1}
        icon={<ArrowLeftIcon />}
        onClick={getPreviousPage}
      />
      <Text>{page}</Text>
      <IconButton
        disabled={!showNextPage}
        icon={<ArrowRightIcon />}
        onClick={getNextPage}
      />
    </HStack>
  );
}

export default Pagination;
