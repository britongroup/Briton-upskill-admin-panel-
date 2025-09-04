import React from 'react';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Tooltip } from '@mui/material';
const PaginationComponent = ({ page, setPage, filteredData, rowsPerPage }) => {
  return (
    <TableRow>
      <div className="float-right mt-2 mb-2">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            disabled={page === 0}
            onClick={() => setPage((prevPage) => prevPage - 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
            </svg>
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase ${
                  page === index
                    ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10'
                    : 'text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20'
                } transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                type="button"
                onClick={() => setPage(index)}
                disabled={page === index}
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">{index + 1}</span>
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            disabled={page === Math.ceil(filteredData.length / rowsPerPage) - 1}
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </TableRow>
  );
};

export default PaginationComponent;
