
export const getReducers = async () => {
  const authModule = await import('./slices/authSlice');
  const productModule = await import('./slices/productSlice');
  const categoryModule = await import('./slices/categorySlice');
  const cartModule = await import('./slices/cartSlice');
  const orderModule = await import('./slices/orderSlice');
  const adminModule = await import('./slices/adminSlice');
  const uiModule = await import('./slices/uiSlice');

  return {
    auth: authModule.default,
    products: productModule.default,
    categories: categoryModule.default,
    cart: cartModule.default,
    orders: orderModule.default,
    admin: adminModule.default,
    ui: uiModule.default,
  };
};
