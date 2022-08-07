import { useEffect, useState } from 'react';

import { API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

const useRoom = ({ id }) => {
  const [isValidRoom, setIsValidRoom] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function check() {
      setLoading(true);
      const isValidRoom = await http.get(`${API_ROUTES.ROOM.BASE}/${id}/isValid`);
      setLoading(false);
      setIsValidRoom(isValidRoom);
    }
    check();
  }, [id]);

  return {
    isValidRoom,
    loading,
  };
};

export default useRoom;
