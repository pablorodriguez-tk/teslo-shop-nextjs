import { Typography } from "@mui/material";
import { Inter } from "@next/font/google";
import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products";
import { FullScrrenLoading } from "../components/ui";
import { useProducts } from "../hooks";

const inter = Inter({ subsets: ["latin"] });

export default function HomePage() {
  const { products, isLoading } = useProducts("/products");

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
      {isLoading ? <FullScrrenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
