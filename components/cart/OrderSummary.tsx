import { Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { useContext } from "react";
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props {
  orderValues?: {
    total: number;
    subTotal: number;
    numberOfItems: number;
    tax: number;
  };
}

export const OrderSummary: NextPage<Props> = ({ orderValues }) => {
  const { total, subTotal, numberOfItems, tax } = useContext(CartContext);

  const summaryValues = orderValues || {
    total,
    subTotal,
    numberOfItems,
    tax,
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {summaryValues.numberOfItems}{" "}
          {summaryValues.numberOfItems > 1 ? "productos" : "producto"}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          {currency.format(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
