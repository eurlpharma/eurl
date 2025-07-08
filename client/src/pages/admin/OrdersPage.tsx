import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import OrdersTable from "@/components/tables/OrdersTable";
import UIButton from "@/components/design/UIButton";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

const OrdersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-3 px-4 mb-4 w-full lg:w-[720px] xl:w-[880px] mx-auto">
        <Typography
          component="div"
          className="font-public-sans text-lg md:text-xl"
        >
          {t("orders.title")}
        </Typography>

        <UIButton
          component={Link}
          size="sm"
          variant="link"
          startIcon={<PlusIcon />}
        >New Order</UIButton>
      </div>

      <div>
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
