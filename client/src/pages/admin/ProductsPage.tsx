import { Box } from "@mui/material";
import TableProducts from "@/components/tables/TableProducts";

const ProductsPage = () => {
  return (
    <Box className="p-4 h-[calc(100vh-14rem)]">
      {/* Tabla de productos */}
      <TableProducts
        isFilter
        isPagination
        isViewAll={"new"}
        header="products"
      />
    </Box>
  );
};

export default ProductsPage;
