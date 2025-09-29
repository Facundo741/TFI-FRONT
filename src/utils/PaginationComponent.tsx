import React from 'react';
import {
  Box,
  Pagination,
  Stack,
  Typography
} from '@mui/material';

interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemsName?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemsName = 'items'
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          Mostrando {startItem}-{endItem} de {totalItems} {itemsName}
        </Typography>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>
    </Box>
  );
};

export default PaginationComponent;