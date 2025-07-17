import React, { useState, useEffect } from "react";
import { Box, Slider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

interface PriceRangeFilterProps {
  onPriceChange: (min: number, max: number) => void;
  onPriceChangeCommitted: () => void;
  maxPrice: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  onPriceChange,
  onPriceChangeCommitted,
  maxPrice,
}) => {
  const { t } = useTranslation();

  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const value = newValue as number[];
    setPriceRange(value);
    onPriceChange(value[0], value[1]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        className="font-public-sans text-lg"
      >
        {t("products.priceRange")}
      </Typography>
      <Slider
        value={priceRange}
        onChange={handleSliderChange}
        onChangeCommitted={onPriceChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={maxPrice}
        valueLabelFormat={(value) =>
          `${numeral(value).format("0,0")} ${t("ammount.da")}`
        }
        sx={{
          color: "#ed1b6f",
          height: 6,
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            borderRadius: 2,
            backgroundColor: "#fff",
            border: "2px solid #ed1b6f",
            "&:hover, &.Mui-focusVisible, &.Mui-active": {
              boxShadow: "0px 0px 0px 6px rgba(255, 0, 102, 0.16)",
            },
          },
          "& .MuiSlider-rail": {
            color: "#ccc",
          },
          "& .MuiSlider-track": {
            color: "#ed1b6f",
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "#ed1b6f",
            borderRadius: "4px",
          },
        }}
      />
    </Box>
  );
};

export default PriceRangeFilter;
