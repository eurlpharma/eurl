import { ProductCartType } from "@/types/product";
import { IconButton } from "@mui/material";
import { ShoppingCartIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { EffectFlip } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { addToCart } from "@/store/slices/cartSlice";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/utils/facebookPixel";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import "swiper/css";


interface ProductCardListProps extends HTMLAttributes<HTMLElement> {
  product: ProductCartType | null;
  isSale?: boolean;
  place?: "top" | "bottom";
}

const ProductCardList: FC<ProductCardListProps> = ({ product, ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useNotification();

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


  return (
    <div
      className="product"
      data-aos="fade-up"
      onClick={() => navigate(`/products/${product.id}`)}
      {...props}
    >
      <div className="thumbs">
        <Swiper
          loop={false}
          speed={600}
          effect="flip"
          slidesPerView={1}
          spaceBetween={10}
          modules={[EffectFlip]}
        >
          {product &&
            product.images.slice(0, 2).map((src, idx) => {
              let imageUrl = src;
              if (
                src &&
                (src.startsWith("/uploads") || src.startsWith("uploads/"))
              ) {
                imageUrl = `https://eurl-server.onrender.com${
                  src.startsWith("/") ? "" : "/"
                }${src}`;
              } else if (
                src &&
                (src.startsWith("http://") || src.startsWith("https://"))
              ) {
                imageUrl = src;
              }
              return (
                <SwiperSlide key={`${product.id}-image-${idx}`}>
                  <img src={imageUrl} className="image" />
                </SwiperSlide>
              );
            })}
        </Swiper>
        <div className="over-mode"></div>
        {product.isFeatured && <div className="over sale">{"Featured"}</div>}
        <div className="in-cart">
          <IconButton
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="text-girl-secondary"
          >
            <ShoppingCartIcon className="w-7 h-7" />
          </IconButton>
        </div>

        {product.countInStock > 0 && (
          <div className="over pink">
            <i className="fi fi-rr-thumbtack flex items-center justify-center"></i>
          </div>
        )}
      </div>

      <div className={clsx("info", "flex flex-col-reverse items-start")}>
        <div className="price ">
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
        <div className="name">{product.name}</div>
      </div>
    </div>
  );
};

export default ProductCardList;
