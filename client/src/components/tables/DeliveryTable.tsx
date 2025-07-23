import {
  Box,
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FC, HTMLAttributes, useState } from "react";

import unDrawError from "../../assets/undraw/bug_fix.svg";
import { useTranslation } from "react-i18next";
import UIButton from "../design/UIButton";
import { IconFilter, IconPrintBold, IconTrashBold } from "../Iconify";
import { Link } from "react-router-dom";
import { FunnelIcon, PlusIcon } from "lucide-react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SimpleBar from "simplebar-react";
import UIChip from "../design/UIChip";
import "simplebar-react/dist/simplebar.min.css";
import { GuepexParcel } from "@/types/delivery";

interface DeliveryTableProps extends HTMLAttributes<HTMLElement> {
  header?: string;
  subHeader?: string;
  isFilter?: boolean;
  isPagination?: boolean;
  isViewAll?: "all" | "add" | null;
  error?: boolean;
  loading?: boolean;
  parcels?: [] | null;
}

const cells = [
  { key: "TID" },
  { key: "OID" },
  { key: "Fullname" },
  { key: "Phone" },
  { key: "Wilaya" },
  { key: "Price" },
  { key: "Status" },
  { key: "common.actions" },
];

const DeliveryTable: FC<DeliveryTableProps> = ({
  header,
  subHeader,
  isFilter,
  isPagination,
  isViewAll,
  error,
  loading,
  parcels,
  ...props
}) => {
  const { t } = useTranslation();
  const [openFilter, setOpenFilter] = useState(false);

  if (error) {
    return (
      <Box className="flex justify-center items-center flex-col gap-4">
        <img
          src={unDrawError}
          alt="Error Orders Page"
          className="w-full lg:w-[50%]"
        />
        <div className="capitalize font-paris text-2xl lg:text-3xl font-semibold text-girl-secondary">
          {t("common.errorOccurred")}
        </div>
      </Box>
    );
  }

  return (
    <div className="shadow-lighter mx-4 my-8 rounded-xl" {...props}>
      <CardHeader
        className="font-public-sans"
        title={header && t(header)}
        subheader={subHeader && t(`${subHeader}`)}
        classes={{
          title: "font-public-sans text-medium lg:text-lg xl:text-xl",
        }}
        action={
          <div className="flex items-center gap-3">
            <UIButton
              startIcon={<IconFilter className="w-4 h-4" />}
              onClick={() => setOpenFilter(!openFilter)}
              className="capitalize text-sm"
              variant="link"
            >
              filter
            </UIButton>

            {isViewAll && (
              <UIButton
                color="grey"
                variant="soft"
                component={Link}
                startIcon={
                  isViewAll === "add" && <PlusIcon className="w-4 h-4" />
                }
                to={isViewAll === "all" ? "/admin/orders" : "/admin/orders"}
                className="text-sm"
              >
                {t(isViewAll === "all" ? "common.viewAll" : "Order")}
              </UIButton>
            )}
          </div>
        }
      />

      {isFilter && (
        <Paper
          className={clsx(
            "overflow-hidden transition-all duration-300",
            openFilter
              ? "p-4 mb-4 h-fit opacity-100"
              : "p-0 m-0 h-0 overflow-hidden opacity-0"
          )}
          classes={{ root: "shadow-none" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t("orders.searchPlaceholder")}
                // value={search}
                // onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t("orders.filterByStatus")}</InputLabel>
                <Select
                  // value={statusFilter}
                  // onChange={(e) =>
                  //   setStatusFilter(e.target.value as OrderStatus | "")
                  // }
                  label={t("orders.filterByStatus")}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  {[
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`orders.status.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>
                  {t("orders.filterByPayment") || "Payment Status"}
                </InputLabel>
                <Select
                  // value={paymentFilter}
                  // onChange={(e) =>
                  //   setPaymentFilter(
                  //     e.target.value as "all" | "paid" | "unpaid"
                  //   )
                  // }
                  label={t("orders.filterByPayment") || "Payment Status"}
                >
                  <MenuItem value="all">{t("common.all")}</MenuItem>
                  <MenuItem value="paid">{t("orders.paid") || "Paid"}</MenuItem>
                  <MenuItem value="unpaid">
                    {t("orders.unpaid") || "Unpaid"}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <UIButton
                radius="lg"
                variant="soft"
                // onClick={handleFilter}
                className="py-3.5 w-full"
                startIcon={<FunnelIcon className="w-5 h-5" />}
              >
                {t("common.filter")}
              </UIButton>
            </Grid>
          </Grid>
        </Paper>
      )}

      <TableContainer component={Paper} className="shadow-none">
        <SimpleBar style={{ maxHeight: "78vh" }}>
          <Table
            className="border-separate"
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px dashed #0000001f",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {cells.map(({ key }) => (
                  <TableCell key={key} className="capitalize font-public-sans">
                    {t(key)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading
                ? Array.from(Array(6)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" component="h2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" component="h2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Box className="flex justify-end items-center gap-2">
                          <Skeleton variant="circular" className="w-6 h-6" />
                          <Skeleton variant="circular" className="w-6 h-6" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                : parcels &&
                  parcels.map((parcel: GuepexParcel, idx) => (
                    <TableRow
                      key={parcel.tracking || idx}
                      className="font-public-sans hover:bg-[#cdcdcd0d] transition duration-700"
                    >
                      <TableCell className="font-public-sans">
                        <Link
                          to={"#"}
                          className="text-primary-600 hover:underline whitespace-nowrap"
                        >
                          {parcel.tracking}
                        </Link>
                      </TableCell>

                      <TableCell className="font-public-sans">
                        <Link
                          to={"#"}
                          className="text-primary-600 hover:underline"
                        >
                          #{parcel.order_id}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography className="whitespace-nowrap font-public-sans">
                            {parcel.firstname} {parcel.familyname}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography className="whitespace-nowrap font-barlow">
                          {parcel.contact_phone}
                        </Typography>
                      </TableCell>

                      <TableCell className="font-poppins">
                        {parcel.to_wilaya_name}
                      </TableCell>

                      <TableCell>
                        <Typography className="whitespace-nowrap flex items-center gap-1 font-barlow font-medium">
                          {parcel.price.toFixed(2)}{" "}
                          {t("ammount.da").toUpperCase()}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <UIChip
                          size="sm"
                          radius="full"
                          variant="soft"
                          className="capitalize px-2"
                        >
                          {parcel.last_status}
                        </UIChip>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end">
                          <IconButton
                            onClick={() =>
                              (window.location.href = parcel.label)
                            }
                            color="secondary"
                            title={t("orders.printInvoice")}
                          >
                            <IconPrintBold />
                          </IconButton>
                          <IconButton
                            /* onClick={() =>
                              handleDeleteClick(order._id || order.id || "")
                            } */
                            color="error"
                            title={t("common.delete")}
                          >
                            <IconTrashBold />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>

      {isPagination && (
        <Box className="flex justify-center py-4">
          <Pagination
            // count={pages}
            // page={page}
            // onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog
        // open={deleteDialogOpen}
        // onClose={handleDeleteCancel}
        open={false}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t("orders.deleteConfirmTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t("orders.deleteConfirmMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            // onClick={handleDeleteCancel}
            color="primary"
          >
            {t("common.cancel")}
          </Button>
          <Button
            // onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        // open={Boolean(anchorEl)}
        // onClose={handleCloseMenu}

        open={false}
      >
        <MenuItem
        /* onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "processing")
          } */
        >
          {t("orders.status.processing")}
        </MenuItem>
        <MenuItem
        /* onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "shipped")
          } */
        >
          {t("orders.status.shipped")}
        </MenuItem>
        <MenuItem
        /* onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "delivered")
          } */
        >
          {t("orders.status.delivered")}
        </MenuItem>
        <MenuItem
        /* onClick={() =>
            selectedOrderId && handleStatusChange(selectedOrderId, "cancelled")
          } */
        >
          {t("orders.status.cancelled")}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DeliveryTable;
