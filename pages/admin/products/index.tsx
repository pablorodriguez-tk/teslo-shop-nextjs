import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AdminLayout } from "../../../components/layouts";
import { IProduct } from "../../../interfaces";
import NextLink from "next/link";
import useSWR from "swr";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Foto",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      const { row } = params;

      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component="img"
            className="fadeIn"
            image={`/products/${row.img}`}
            alt={row.title}
          />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Título",
    width: 250,
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      const { row } = params;
      return (
        <NextLink href={`products/${row.slug}`} passHref legacyBehavior>
          <Link style={{ textDecoration: "underline" }} underline={"always"}>
            {row.title}
          </Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Género" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Inventario" },
  { field: "price", headerName: "Precio" },
  { field: "sizes", headerName: "Tallas", width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (error) return <p>Error al cargar la información</p>;
  if (!data) return <></>;

  const rows = data.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subtitle={"Mantenimiento de productos"}
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear producto
        </Button>
      </Box>
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
export default ProductsPage;
