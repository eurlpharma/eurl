import React, { useState, useEffect } from "react";
import { Box, Slider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
        className="font-josefin text-lg"
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
        valueLabelFormat={(value) => `${value} ${t("common.currency")}`}
      />
    </Box>
  );
};

export default PriceRangeFilter;
