import { ShopLayout } from "../../components/layouts";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from "next/link";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "fullname",
    headerName: "Nombre Completo",
    width: 300,
  },
  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra información si está pagada la orden o no",
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No Pagada" variant="outlined" />
      );
    },
  },
  {
    field: "orden",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} legacyBehavior passHref>
          <Link>Ver orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    fullname: "Pablo Rodriguez",
    paid: true,
  },
  {
    id: 2,
    fullname: "Hector Salamanca",
    paid: true,
  },
  {
    id: 3,
    fullname: "Nicolas Perez",
    paid: false,
  },
  {
    id: 4,
    fullname: "Ramon Gonzales",
    paid: true,
  },
  {
    id: 5,
    fullname: "Erica Nix",
    paid: false,
  },
  {
    id: 6,
    fullname: "Sandra Edip",
    paid: true,
  },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default HistoryPage;
