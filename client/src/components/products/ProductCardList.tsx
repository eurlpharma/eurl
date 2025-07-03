import { ProductCartType } from "@/types/product";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
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
}

interface ProductOnCart {
  id: string;
  image: string;
  name: string;
  price: Number;
  product: string;
  quantity: number;
}

const ProductCardList: FC<ProductCardListProps> = ({ product, ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ProductSaved, setProductSaved] = useState<null | ProductOnCart[]>(
    null
  );

  if (!product) {
    return <div>Wait...</div>;
  }

  const handleAddToCart = async () => {
    try {
      if (product && product.id) {
        const result = await dispatch(
          addToCart({ productId: product.id, quantity: 1 })
        );
        if (addToCart.fulfilled.match(result)) {
          success(t("products.addedToCart"));
        } else {
          if (result.payload === "Not enough stock available") {
            error(t("products.notEnoughStock"));
          } else if (
            result.payload === "Invalid product data received from server"
          ) {
            error(t("products.invalidProduct"));
          } else if (typeof result.payload === "string") {
            error(result.payload);
          } else {
            error(t("common.errorOccurred"));
          }
        }
      }
      trackEvent("AddToCart", {
        Product: product.name,
        Price: product.price,
        Quantity: 1,
      });
    } catch (err) {
      error(t("common.errorOccurred"));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("cartItems")) {
      const localItemSaved: null | any = localStorage.getItem("cartItems");
      setProductSaved(localItemSaved);
    } else {
      setProductSaved(null);
    }
  }, [localStorage, dispatch]);

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
              {ProductSaved?.includes(product.id) ? (
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
