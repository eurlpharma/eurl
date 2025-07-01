import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AppDispatch, RootState } from "@/store";
import { createOrder, resetOrderSuccess } from "@/store/slices/orderSlice";
import { clearCart, ShippingAddress } from "@/store/slices/cartSlice";
import { useNotification } from "@/hooks/useNotification";

// Step components
import ShippingForm from "@/components/checkout/ShippingForm";
import ReviewOrder from "@/components/checkout/ReviewOrder";
import Breadcrumb from "@/components/global/Breadcrumb";
import clsx from "clsx";

const steps = ["shipping", "review"];

const CheckoutPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { success } = useNotification();

  const { items: cartItems, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );
  const {
    loading: orderLoading,
    error: orderError,
    success: orderSuccess,
    order,
  } = useSelector((state: RootState) => state.orders);

  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState<any>({
    fullName: "",
    phone: "",
    wilaya: "",
    daira: "",
    address: "",
  });
  // Método de pago fijo como contra reembolso
  const paymentMethod = "cash_on_delivery";

  // Redirect to order page when order is created successfully
  useEffect(() => {
    if (orderSuccess && order) {
      success(t("checkout.orderSuccess"));
      dispatch(clearCart());
      dispatch(resetOrderSuccess());
      navigate(`/orders/${order._id}`);
    }
  }, [orderSuccess, order, dispatch, navigate, success, t]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, cartLoading, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingSubmit = (data: ShippingAddress): any => {
    setShippingData({
      ...data,
      address: data.address || "",
    });
    handleNext();
  };

  const handlePlaceOrder = async () => {
    const itemsPrice = Array.isArray(cartItems)
      ? cartItems.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        )
      : 0;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2)
    );

    let orderData: any = {
      orderItems: Array.isArray(cartItems)
        ? cartItems.map((item: any) => ({
            product: item.product,
            qty: Number(item.quantity) || 1,
            name: item.name,
            price: item.price,
            image: item.image,
          }))
        : [],
      shippingAddress: {
        ...shippingData,
        country: shippingData.country || "Algeria",
        city: shippingData.city || shippingData.wilaya || "",
        postalCode:
          shippingData.postalCode && shippingData.postalCode.trim() !== ""
            ? shippingData.postalCode
            : "16000",
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isGuest: !user,
    };

    if (!user) {
      orderData.guestInfo = {
        name: shippingData.fullName,
        phone: shippingData.phone,
        email: shippingData.email || "",
      };
    }

    try {
      await dispatch(createOrder(orderData)).unwrap();
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Error creating order:", error);
      }
      throw error;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ShippingForm
            onSubmit={handleShippingSubmit}
            initialData={shippingData}
          />
        );
      case 1:
        return (
          <ReviewOrder
            shippingData={shippingData}
            paymentMethod={paymentMethod}
            cartItems={cartItems}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Checkout" />
      <Container maxWidth="lg" className="py-8">
        <Paper className="p-6 shadow-none rounded-none">
          {orderError && (
            <Alert severity="error" className="mb-4">
              {orderError}
            </Alert>
          )}

          <Stepper activeStep={activeStep} className="mb-8">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{t(`checkout.${label}`)}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {getStepContent(activeStep)}

            <Box className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                disabled={activeStep === 0 || orderLoading}
                className={clsx(
                  "border-girl-secondary border-solid border-1 px-4",
                  "text-girl-secondary font-josefin hover:text-girl-white",
                  "hover:bg-girl-secondary cursor-pointer"
                )}
              >
                {t("checkout.back")}
              </button>

              {activeStep === steps.length - 1 ? (
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className={clsx(
                    " px-5 py-2 flex items-center gap-1",
                    " font-josefin text-girl-white",
                    "bg-girl-secondary cursor-pointer"
                  )}
                >
                  {orderLoading && (
                    <CircularProgress size={20} color="inherit" />
                  )}
                  {orderLoading
                    ? t("checkout.processing")
                    : t("checkout.placeOrder")}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={orderLoading}
                  className={clsx(
                    " px-5 py-2",
                    " font-josefin text-girl-white",
                    "bg-girl-secondary cursor-pointer"
                  )}
                >
                  {t("checkout.next")}
                </button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default CheckoutPage;
