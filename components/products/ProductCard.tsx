import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Link,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import { FC, useMemo, useState } from "react";
import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          passHref
          prefetch={false}
          legacyBehavior
        >
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="No hay disponibles"
                  sx={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
                />
              )}
              <CardMedia
                component="img"
                className="fadeIn"
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
