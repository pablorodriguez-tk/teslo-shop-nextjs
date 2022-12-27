import { Typography } from "@mui/material";
import { Inter } from "@next/font/google";
import { ShopLayout } from "../components/layouts";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <ShopLayout
      title={"Teslo-Shop - Home"}
      pageDescription={"Encuentra los mejores productos de Teslo aqui"}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
    </ShopLayout>
  );
}
