import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UiContext } from "../../context";

export const Navbar = () => {
  const { toogleSideMenu } = useContext(UiContext);
  const { asPath } = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6"> Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button
                variant="contained"
                color={asPath === "/category/men" ? "primary" : "info"}
                sx={{
                  ":hover": {
                    backgroundColor:
                      asPath === "/category/men" ? "primary.main" : "info.main",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button
                variant="contained"
                color={asPath === "/category/women" ? "primary" : "info"}
                sx={{
                  ":hover": {
                    backgroundColor:
                      asPath === "/category/women"
                        ? "primary.main"
                        : "info.main",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button
                variant="contained"
                color={asPath === "/category/kid" ? "primary" : "info"}
                sx={{
                  ":hover": {
                    backgroundColor:
                      asPath === "/category/kid" ? "primary.main" : "info.main",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toogleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
