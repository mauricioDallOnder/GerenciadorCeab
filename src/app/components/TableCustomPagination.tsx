import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useGridApiContext, useGridSelector, gridPageSelector, gridPageCountSelector, GridCsvGetRowsToExportParams, gridExpandedSortedRowIdsSelector, GridCsvExportOptions } from "@mui/x-data-grid";
import DownloadingIcon from "@mui/icons-material/Downloading";

export default function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
      gridExpandedSortedRowIdsSelector(apiRef);
  
    const handleExport = (options: GridCsvExportOptions) =>
      apiRef.current.exportDataAsCsv(options);
  
    return (
      <>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={page + 1}
          count={pageCount}
          // @ts-expect-error
          renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
          onChange={(event: React.ChangeEvent<unknown>, value: number) =>
            apiRef.current.setPage(value - 1)
          }
        />
  
        <Button
          onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
          sx={{ gap: "2px", display: "flex", alignItems: "center" }}
          variant="contained"
          color="secondary"
        >
          <DownloadingIcon />
          Exportar as linhas filtradas para excel.
        </Button>
      </>
    );
  }
  