import { FC, PropsWithChildren, useEffect, useReducer } from "react";
import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    Cookies.get("cart") &&
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: JSON.parse(Cookies.get("cart") || "[]"),
      });
  }, []);

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);

    if (!productInCart) {
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    }

    const productInCartWithSameSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );

    if (!productInCartWithSameSize) {
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    }

    const updatedCart = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      p.quantity += product.quantity;
      return p;
    });

    dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedCart,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        //Methods
        addProductToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
