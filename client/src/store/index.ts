import { createAppStore } from './createStore';
import { combineReducers, Reducer, AnyAction } from 'redux';

type ReducersMapObject = { [key: string]: Reducer<any, AnyAction> };

const dummyReducer = (state = {}) => state;

const initialReducers: ReducersMapObject = {
  auth: dummyReducer,
  products: dummyReducer,
  categories: dummyReducer,
  cart: dummyReducer,
  orders: dummyReducer,
  admin: dummyReducer,
  ui: dummyReducer,
  settings: dummyReducer
};

export const store = createAppStore(initialReducers);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


const importReducers = async () => {
  try {
    const authReducer = (await import('./slices/authSlice')).default;
    const currentReducers: ReducersMapObject = { ...initialReducers, auth: authReducer };
    store.replaceReducer(combineReducers(currentReducers));

    const productReducer = (await import('./slices/productSlice')).default;
    const withProducts: ReducersMapObject = { ...currentReducers, products: productReducer };
    store.replaceReducer(combineReducers(withProducts));

    const categoryReducer = (await import('./slices/categorySlice')).default;
    const withCategories: ReducersMapObject = { ...withProducts, categories: categoryReducer };
    store.replaceReducer(combineReducers(withCategories));

    const cartReducer = (await import('./slices/cartSlice')).default;
    const withCart: ReducersMapObject = { ...withCategories, cart: cartReducer };
    store.replaceReducer(combineReducers(withCart));

    const orderReducer = (await import('./slices/orderSlice')).default;
    const withOrders: ReducersMapObject = { ...withCart, orders: orderReducer };
    store.replaceReducer(combineReducers(withOrders));

    const adminReducer = (await import('./slices/adminSlice')).default;
    const withAdmin: ReducersMapObject = { ...withOrders, admin: adminReducer };
    store.replaceReducer(combineReducers(withAdmin));

    const uiReducer = (await import('./slices/uiSlice')).default;
    const withUI: ReducersMapObject = { ...withAdmin, ui: uiReducer };
    store.replaceReducer(combineReducers(withUI));

    const settingsReducer = (await import('./slices/settingsSlice')).default;
    const withSettings: ReducersMapObject = { ...withUI, settings: settingsReducer };
    store.replaceReducer(combineReducers(withSettings));

  } catch (error) {
    return null;
  }
};

importReducers();

export default store;
