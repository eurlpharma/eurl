import {
  Box,
  Button,
  CardHeader,
  Collapse,
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
import { FC, Fragment, HTMLAttributes, useState } from "react";

import unDrawError from "../../assets/undraw/bug_fix.svg";
import { useTranslation } from "react-i18next";
import UIButton from "../design/UIButton";
import { IconEyeBold, IconFilter, IconSwitch, IconTrashBold } from "../Iconify";
import { Link } from "react-router-dom";
import { FunnelIcon, PlusIcon } from "lucide-react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SimpleBar from "simplebar-react";
import UIChip from "../design/UIChip";
import "simplebar-react/dist/simplebar.min.css";
import { GuepexParcel } from "@/types/delivery";
import { formatPhone } from "@/utils/numbers";

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
  { key: "ID" },
  { key: "Fullname" },
  { key: "Phone" },
  { key: "Wilaya" },
  { key: "Price" },
  { key: "Status" },
  { key: "common.actions" },
];

const guepexStatusMap: Record<
  string,
  {
    label: string;
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error";
  }
> = {
  "colis prêt": { label: "ready", color: "warning" },
  "étiquette créée": { label: "labeled", color: "info" },
  "label created": { label: "labeled", color: "info" },
  "en transit": { label: "transit", color: "primary" },
  "en cours": { label: "processing", color: "info" },
  "en chemin": { label: "transit", color: "primary" },
  "en livraison": { label: "delivering", color: "primary" },
  livré: { label: "delivered", color: "success" },
  "retourné au vendeur": { label: "returned", color: "error" },
  retardé: { label: "delayed", color: "warning" },
  incident: { label: "issue", color: "error" },
  anomalie: { label: "issue", color: "error" },
  "livré en relais": { label: "pickup", color: "info" },
  "retour au site": { label: "returned", color: "error" },
};

const PhoneCell = ({ rawPhones }: { rawPhones: string }) => {
  const phones = rawPhones
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p);

  const [index, setIndex] = useState(0);

  const togglePhone = () => {
    setIndex((prev) => (prev + 1) % phones.length);
  };

  const currentPhone = phones[index];

  return (
    <Typography className="whitespace-nowrap font-barlow text-sm md:text-base flex items-center gap-1">
      <a
        href={`tel:${currentPhone}`}
        className="block w-[88px] md:w-[92px] hover:underline whitespace-nowrap text-sm md:text-base"
      >
        {formatPhone(currentPhone)}
      </a>

      {phones.length > 1 && (
        <IconButton onClick={togglePhone} title="Switch Phone" size="small">
          <IconSwitch className="w-5 h-5 transition" />
        </IconButton>
      )}
    </Typography>
  );
};

const SkeletonRows = () => {
  return (
    <>
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
    </>
  );
};

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
  const [expandedTracking, setExpandedTracking] = useState<string | null>(null);

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
          title: "font-public-sans font-semibold text-lg lg:text-lg xl:text-xl",
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
                <Select label={t("orders.filterByStatus")}>
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
                ? Array.from(Array(8)).map((_, index) => (
                    <TableRow key={index}>
                      <SkeletonRows />
                    </TableRow>
                  ))
                : parcels &&
                  parcels.map((parcel: GuepexParcel, idx) => {
                    const statusInfo = guepexStatusMap[
                      parcel.last_status?.toLowerCase() || ""
                    ] ?? {
                      label: parcel.last_status,
                      color: "default",
                    };

                    return (
                      <Fragment key={parcel.tracking || idx}>
                        <TableRow className="hover:bg-[#cdcdcd0d] transition duration-700">
                          <TableCell>
                            <Link
                              to={"#"}
                              className="text-primary-600 hover:underline font-barlow"
                            >
                              #{parcel.order_id.padStart(3, "0")}
                            </Link>
                          </TableCell>

                          <TableCell>
                            <Typography className="whitespace-nowrap text-tiny sm:text-sm md:text-base capitalize">
                              {parcel.firstname} {parcel.familyname}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <PhoneCell rawPhones={parcel.contact_phone} />
                          </TableCell>

                          <TableCell>
                            <Typography className="whitespace-nowrap text-sm md:text-base">
                              {parcel.to_wilaya_name}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography className="whitespace-nowrap text-sm md:text-base">
                              {parcel.price.toFixed(2)}{" "}
                              {t("ammount.da").toUpperCase()}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <UIChip
                              size="sm"
                              variant="soft"
                              color={statusInfo.color}
                            >
                              {statusInfo.label}
                            </UIChip>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-end">
                              <IconButton
                                onClick={() =>
                                  setExpandedTracking(
                                    expandedTracking === parcel.tracking
                                      ? null
                                      : parcel.tracking
                                  )
                                }
                                color="default"
                              >
                                <IconEyeBold />
                              </IconButton>

                              <IconButton
                                color="error"
                                title={t("common.delete")}
                              >
                                <IconTrashBold />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Collapse row */}
                        <TableRow>
                          <TableCell
                            colSpan={cells.length}
                            sx={{ padding: 0, border: 0 }}
                          >
                            <Collapse
                              in={expandedTracking === parcel.tracking}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box className="p-4 bg-gray-50 text-sm text-gray-700 space-y-2 font-public-sans">
                                <div>
                                  <strong>Tracking:</strong> {parcel.tracking}
                                </div>

                                <div>
                                  <strong>Stopdeskid:</strong> {parcel.stopdesk_id}
                                </div>

                                <div>
                                  <strong>Stopdesk name:</strong> {parcel.stopdesk_name}
                                </div>

                                <div>
                                  <strong>to_commune_name:</strong> {parcel.to_commune_name}
                                </div>

                                <div>
                                  <strong>product_list:</strong> {parcel.product_list}
                                </div>

                                <div>
                                  <strong>do_insurance:</strong> {parcel.do_insurance}
                                </div>

                                <div>
                                  <strong>declared_value:</strong> {parcel.declared_value}
                                </div>

                                <div>
                                  <strong>length:</strong> {parcel.length}
                                </div>

                                <div>
                                  <strong>height:</strong> {parcel.height}
                                </div>

                                <div>
                                  <strong>weight:</strong> {parcel.weight}
                                </div>

                                <div>
                                  <strong>delivery_fee:</strong> {parcel.delivery_fee}
                                </div>

                                <div>
                                  <strong>freeshipping:</strong> {parcel.freeshipping}
                                </div>

                                <div>
                                  <strong>import_id:</strong> {parcel.import_id}
                                </div>

                                <div>
                                  <strong>date_expedition:</strong> {parcel.date_expedition}
                                </div>

                                <div>
                                  <strong>date_last_status:</strong> {parcel.date_last_status}
                                </div>

                                <div>
                                  <strong>last_status:</strong> {parcel.last_status}
                                </div>

                                <div>
                                  <strong>taxe_percentage:</strong> {parcel.taxe_percentage}
                                </div>

                                <div>
                                  <strong>taxe_from:</strong> {parcel.taxe_from}
                                </div>

                                <div>
                                  <strong>taxe_retour:</strong> {parcel.taxe_retour}
                                </div>

                                <div>
                                  <strong>parcel_type:</strong> {parcel.parcel_type}
                                </div>

                                <div>
                                  <strong>parcel_sub_type:</strong> {parcel.parcel_sub_type}
                                </div>

                                <div>
                                  <strong>has_receipt:</strong> {parcel.has_receipt}
                                </div>

                                <div>
                                  <strong>has_recouvrement:</strong> {parcel.has_recouvrement}
                                </div>

                                <div>
                                  <strong>return_center_code:</strong> {parcel.return_center_code}
                                </div>

                                <div>
                                  <strong>current_center_id:</strong> {parcel.current_center_id}
                                </div>

                                <div>
                                  <strong>current_center_name:</strong> {parcel.current_center_name}
                                </div>

                                <div>
                                  <strong>current_wilaya_id:</strong> {parcel.current_wilaya_id}
                                </div>

                                <div>
                                  <strong>current_wilaya_name:</strong> {parcel.current_wilaya_name}
                                </div>

                                <div>
                                  <strong>current_commune_id:</strong> {parcel.current_commune_id}
                                </div>

                                <div>
                                  <strong>current_commune_name:</strong> {parcel.current_commune_name}
                                </div>

                                <div>
                                  <strong>payment_status:</strong> {parcel.payment_status}
                                </div>

                                <div>
                                  <strong>payment_id:</strong> {parcel.payment_id}
                                </div>

                                <div>
                                  <strong>has_exchange:</strong> {parcel.has_exchange}
                                </div>

                                <div>
                                  <strong>product_to_collect:</strong> {parcel.product_to_collect}
                                </div>

                                <div>
                                  <strong>economic:</strong> {parcel.economic}
                                </div>

                                <div>
                                  <strong>label:</strong> {parcel.label}
                                </div>

                                <div>
                                  <strong>pin:</strong> {parcel.pin}
                                </div>

                                <div>
                                  <strong>qr_text:</strong> {parcel.qr_text}
                                </div>

                                <div>
                                  <strong>Address:</strong> {parcel.address}
                                </div>
                                <div>
                                  <strong>Created At:</strong>{" "}
                                  {parcel.date_creation}
                                </div>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
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
