import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AdminLayout } from "../../../components/layouts";
import { IOrder, IUser } from "../../../interfaces";
import useSWR from "swr";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 230 },
  { field: "email", headerName: "Correo", width: 200 },
  { field: "name", headerName: "Nombre Completo", width: 170 },
  { field: "total", headerName: "Monto total", width: 100 },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      const { row } = params;
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: "noProducts",
    headerName: "No.Productos",
    align: "center",
    width: 120,
  },
  {
    field: "check",
    headerName: "Ver orden",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      const { row } = params;
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Creada en",
    width: 200,
  },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (error) return <p>Error al cargar la información</p>;
  if (!data) return <></>;

  const rows = data.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={"Ordenes"}
      subtitle={"Mantenimiento de ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
export default OrdersPage;
