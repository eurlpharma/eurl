import { Box, Typography } from "@mui/material";
import { FC, HTMLAttributes, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface OrderInfoBoxProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
  subTitle?: string;
}

const OrderInfoBox: FC<OrderInfoBoxProps> = ({
  children,
  title,
  subTitle,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <div {...props}>
      <Box className="p-4 space-y-4">
        {title && (
          <Typography className="font-medium font-public-sans lg:text-lg">
            {t(title)}
          </Typography>
        )}
        <Box className="space-y-1">
         {children}
        </Box>
      </Box>
    </div>
  );
};

export default OrderInfoBox;
