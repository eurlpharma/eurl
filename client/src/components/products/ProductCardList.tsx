import { ProductCartType } from "@/types/product";
import { IconButton, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { addToCart } from "@/store/slices/cartSlice";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/utils/facebookPixel";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { IconCart, IconCartBold } from "../Iconify";

interface ProductCardListProps extends HTMLAttributes<HTMLElement> {
  product: ProductCartType | null;
  isSale?: boolean;
  place?: "top" | "bottom";
  isLoading?: boolean
}

interface ProductOnCart {
  id: string;
  image: string;
  name: string;
  price: Number;
  product: string;
  quantity: number;
}

const ProductCardList: FC<ProductCardListProps> = ({ product, isLoading=false, ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ProductSaved, setProductSaved] = useState<null | ProductOnCart[]>(
    null
  );

  if (!product || isLoading) {
    return (
      <div>
        <Skeleton variant="rectangular" className="rounded-lg h-[14rem] lg:h-72 pb-3" />
        <Skeleton variant="text" className="w-2/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product || !product.id) return;

    const isInCart = ProductSaved?.some((item) => item.product === product.id);

    try {
      if (isInCart) {
        const updatedCart =
          ProductSaved?.filter((item) => item.product !== product.id) || [];

        setProductSaved(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));

        success(t("products.removedFromCart"));
      } else {
        const result = await dispatch(
          addToCart({ productId: product.id, quantity: 1 })
        );

        if (addToCart.fulfilled.match(result)) {
          const newItem: ProductOnCart = {
            id: product.id,
            image: product.images[0],
            name: product.name,
            price: product.price,
            product: product.id,
            quantity: 1,
          };

          const updated = ProductSaved ? [...ProductSaved, newItem] : [newItem];
          setProductSaved(updated);
          localStorage.setItem("cartItems", JSON.stringify(updated));

          success(t("products.addedToCart"));

          trackEvent("AddToCart", {
            Product: product.name,
            Price: product.price,
            Quantity: 1,
          });
        } else {
          if (result.payload === "Not enough stock available") {
            error(t("products.notEnoughStock"));
          } else {
            error(
              typeof result.payload === "string"
                ? result.payload
                : t("common.errorOccurred")
            );
          }
        }
      }
    } catch (err) {
      error(t("common.errorOccurred"));
    }
  };

  useEffect(() => {
    try {
      const localItem = localStorage.getItem("cartItems");
      if (localItem) {
        const parsed = JSON.parse(localItem);
        if (Array.isArray(parsed)) {
          setProductSaved(parsed);
        } else {
          setProductSaved([]);
        }
      } else {
        setProductSaved([]);
      }
    } catch (e) {
      error("Invalid cart items data");
      setProductSaved([]);
    }
  }, [localStorage]);

  return (
    <div className="product" data-aos="fade-up" {...props}>
      <div
        className="thumbs relative"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          loading="eager"
          decoding="async"
          className="image"
          src={product.images[0]}
          alt={`${product.name}`}
          {...{ fetchpriority: "high" }}
        />
        {!isMobile && <div className="over-mode"></div>}

        {product.isFeatured && <div className="over sale">{"Featured"}</div>}

        {!isMobile && (
          <div className="in-cart">
            <IconButton
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="text-girl-secondary"
            >
              <IconCart className="w-7 h-7" />
            </IconButton>
          </div>
        )}

        {product.countInStock > 0 && (
          <div className="over pink">
            <i className="fi fi-rr-thumbtack flex items-center justify-center"></i>
          </div>
        )}
      </div>

      <div className={clsx("info", "flex flex-col-reverse items-start")}>
        <div className="flex items-end justify-between gap-2 w-full">
          <div
            className="price "
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {product.oldPrice && product.oldPrice > product.price ? (
              <div className="space-x-2">
                <span className="text-girl-secondary">DA {product.price}</span>
                <span className="line-through text-sm text-gray-600">
                  DA {product.oldPrice}
                </span>
              </div>
            ) : (
              <span>DA {product.price}</span>
            )}
          </div>

          {isMobile && product.countInStock > 0 && (
            <div onClick={handleAddToCart}>
              {ProductSaved &&
              ProductSaved?.some((item) => item.product === product.id) ? (
                <IconCartBold className="text-girl-secondary" />
              ) : (
                <IconCart className="text-girl-secondary" />
              )}
            </div>
          )}
        </div>

        <div
          className="name"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
