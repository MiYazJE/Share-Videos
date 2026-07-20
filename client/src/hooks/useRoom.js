import { useQuery } from '@tanstack/react-query';
import { validateRoom } from 'src/api/rooms';
import { queryKeys } from 'src/queries/keys';

const useRoom = ({ id }) => {
  const query = useQuery({
    queryKey: queryKeys.room(id),
    queryFn: ({ signal }) => validateRoom({ id, signal }),
    enabled: Boolean(id),
    staleTime: 10 * 1000,
  });

  return {
    isValidRoom: query.data,
    loading: query.isPending,
    ...query,
  };
};

export default useRoom;
