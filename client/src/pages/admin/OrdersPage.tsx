import OrdersTable from "@/components/tables/OrdersTable";

const OrdersPage = () => {
  return (
    <OrdersTable
      isFilter
      isPagination
      isViewAll={"add"}
      header="orders.title"
    />
  );
};

export default OrdersPage;
