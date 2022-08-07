import { useCallback, useState } from 'react';

const usePagination = ({
  limit = 10,
  onSearch,
}) => {
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearch = useCallback(async (params) => {
    try {
      const result = await onSearch({ limit, ...params });
      setLoading(false);
      return result;
    } catch (e) { /* */ }

    setLoading(false);
    return [];
  }, [limit, onSearch]);

  const getPreviousPage = useCallback((params = {}) => {
    setOffset((prevOffset) => prevOffset - limit);
    setPage((prevPage) => prevPage - 1);
    return handleSearch({ ...params, offset: offset - limit });
  }, [handleSearch, limit, offset]);

  const getNextPage = useCallback((params = {}) => {
    setOffset((prevOffset) => prevOffset + limit);
    setPage((prevPage) => prevPage + 1);
    return handleSearch({ ...params, offset: offset + limit });
  }, [handleSearch, limit, offset]);

  const resetPagination = useCallback(() => {
    setOffset(0);
    setPage(1);
  }, [setOffset]);

  return {
    getPreviousPage,
    getNextPage,
    resetPagination,
    loading,
    page,
  };
};

export default usePagination;
