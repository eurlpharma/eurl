import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/store/slices/categorySlice";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardHeader,
  Skeleton,
} from "@mui/material";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNotification } from "@/hooks/useNotification";
import { useLocalizedCategories } from "@/hooks/useLocalizedCategory";
import ImageIcon from "@mui/icons-material/Image";
import UIButton from "@/components/design/UIButton";
import { Link } from "react-router-dom";
import { IconPenBold, IconTrashBold } from "@/components/Iconify";
import UIChip from "@/components/design/UIChip";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  description?: string;
  isActive: boolean;
  image?: string;
}

const CategoriesPage = () => {
  const { t } = useTranslation();
  const { success, error } = useNotification();

  const dispatch = useDispatch();
  const {
    categories,
    loading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.categories);
  const localizedCategories = useLocalizedCategories(categories || []);

  useEffect(() => {
    dispatch(getCategories() as any);
  }, [dispatch]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    nameFr: "",
    description: "",
    isActive: true,
    image: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setFormData({
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        nameFr: category.nameFr,
        description: category.description || "",
        isActive: category.isActive,
        image: null,
      });
      setSelectedCategory(category);
      if (category.image) {
        setPreviewImage(
          category.image.startsWith("http")
            ? category.image
            : `https://pharma-api-e5sd.onrender.com/uploads/categories/${category.image}`
        );
      } else {
        setPreviewImage("");
      }
    } else {
      setFormData({
        nameAr: "",
        nameEn: "",
        nameFr: "",
        description: "",
        isActive: true,
        image: null,
      });
      setSelectedCategory(null);
      setPreviewImage("");
    }
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nameAr.trim()) {
      errors.nameAr = t("validation.required");
    }
    if (!formData.nameEn.trim()) {
      errors.nameEn = t("validation.required");
    }
    if (!formData.nameFr.trim()) {
      errors.nameFr = t("validation.required");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr);
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("nameFr", formData.nameFr);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isActive", formData.isActive.toString());

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (selectedCategory) {
        const result = await dispatch(
          updateCategory({
            id: selectedCategory.id,
            categoryData: formDataToSend,
          }) as any
        ).unwrap();

        if (result.image) {
          setPreviewImage(
            result.image.startsWith("http")
              ? result.image
              : `https://pharma-api-e5sd.onrender.com/uploads/categories/${result.image}`
          );
        }

        success(t("admin.categoryUpdated"));
      } else {
        const result = await dispatch(
          createCategory(formDataToSend) as any
        ).unwrap();

        if (result.image) {
          setPreviewImage(
            result.image.startsWith("http")
              ? result.image
              : `https://pharma-api-e5sd.onrender.com/uploads/categories/${result.image}`
          );
        }

        success(t("admin.categoryCreated"));
      }

      dispatch(getCategories() as any);
      handleCloseDialog();
    } catch (err: any) {
      error(err?.message || t("error.general"));
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await dispatch(deleteCategory(selectedCategory.id) as any).unwrap();
        success(t("admin.categoryDeleted"));
        handleCloseDeleteDialog();
      } catch (err: any) {
        error(err?.message || t("error.general"));
      }
    }
  };

  return (
    <Box className="p-4">
      <Card classes={{ root: "shadow-lighter p-0 rounded-xl" }}>
        <CardHeader
          className="font-public-sans"
          title={t(`admin.categories`)}
          classes={{
            title: "font-public-sans text-medium lg:text-lg xl:text-xl",
          }}
          action={
            <div className="flex items-center gap-3">
              <UIButton
                color="grey"
                variant="link"
                component={Link}
                size="sm"
                startIcon={<PlusIcon className="w-6 h-6" />}
                onClick={() => handleOpenDialog()}
              >
                {t("admin.addCategory")}
              </UIButton>
            </div>
          }
        />

        <TableContainer component={Paper} className="shadow-none">
          <Table
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px dashed #0000001f",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell className="capitalize font-public-sans">
                  {t("categories.image")}
                </TableCell>
                <TableCell className="capitalize font-public-sans">
                  {t("categories.name")}
                </TableCell>
                <TableCell className="capitalize font-public-sans">
                  {t("categories.description")}
                </TableCell>
                <TableCell className="capitalize font-public-sans">
                  {t("categories.status")}
                </TableCell>
                <TableCell
                  className="capitalize font-public-sans"
                  align="right"
                >
                  {t("common.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from(Array(6)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-10 w-10" variant="rounded" />
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
                      <Box className="flex justify-end items-center gap-2">
                        <Skeleton variant="circular" className="w-6 h-6" />
                        <Skeleton variant="circular" className="w-6 h-6" />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {categoriesError && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    style={{ color: "red" }}
                  >
                    {categoriesError}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
              !categoriesError &&
              localizedCategories &&
              localizedCategories.length > 0
                ? localizedCategories.map(
                    (category: Category & { localizedName: string }) => (
                      <TableRow
                        key={category.id}
                        className="font-public-sans hover:bg-[#cdcdcd0d] transition duration-700"
                      >
                        <TableCell>
                          <img
                            src={
                              category.image
                                ? category.image.startsWith("http")
                                  ? category.image
                                  : `https://pharma-api-e5sd.onrender.com/uploads/categories/${category.image}`
                                : "/images/placeholder.png"
                            }
                            alt={category.localizedName}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        </TableCell>
                        <TableCell className="font-public-sans whitespace-nowrap capitalize">
                          {category.localizedName}
                        </TableCell>
                        <TableCell className="font-public-sans whitespace-nowrap capitalize">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell>
                          <UIChip
                            color={category.isActive ? "primary" : "error"}
                            variant="soft"
                            radius="full"
                          >
                            {category.isActive
                              ? t("common.active")
                              : t("common.inactive")}
                          </UIChip>
                        </TableCell>
                        <TableCell align="right">
                          <div className="flex items-center justify-end">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(category)}
                              size="small"
                            >
                              <IconPenBold />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(category)}
                              size="small"
                            >
                              <IconTrashBold />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                : !loading &&
                  !categoriesError && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {t("admin.noCategories")}
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        container={document.getElementById("root")}
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        className="backdrop-blur-sm bg-white/10 transit"
        classes={{
          paper:
            "shadow-lighter rounded-xl min-w-[96%] lg:min-w-fit lg:max-w-[18rem]",
        }}
      >
        <DialogTitle className="font-public-sans">
          {selectedCategory ? t("admin.editCategory") : t("admin.addCategory")}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label={t("categories.nameAr")}
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              error={!!formErrors.nameAr}
              helperText={formErrors.nameAr}
            />
            <TextField
              fullWidth
              label={t("categories.nameEn")}
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              error={!!formErrors.nameEn}
              helperText={formErrors.nameEn}
            />
            <TextField
              fullWidth
              label={t("categories.nameFr")}
              name="nameFr"
              value={formData.nameFr}
              onChange={handleChange}
              error={!!formErrors.nameFr}
              helperText={formErrors.nameFr}
            />
            <TextField
              fullWidth
              label={t("categories.description")}
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>{t("categories.status")}</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={(e) => handleChange(e as SelectChangeEvent)}
                label={t("categories.status")}
              >
                <MenuItem value="true">{t("common.active")}</MenuItem>
                <MenuItem value="false">{t("common.inactive")}</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle1" className="mb-2">
                {t("categories.image")}
              </Typography>
              <Box
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                )}
                <Typography variant="body2" color="text.secondary">
                  {typeof t("categories.uploadImage") === "string"
                    ? t("categories.uploadImage")
                    : "رفع صورة"}
                </Typography>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <UIButton variant="soft" color="error" onClick={handleCloseDialog}>
            {t("common.cancel")}
          </UIButton>
          <UIButton
            onClick={handleSaveCategory}
            variant="filled"
            color="primary"
          >
            {t("common.save")}
          </UIButton>
        </DialogActions>
      </Dialog>

      <Dialog
        container={document.getElementById("root")}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        className="backdrop-blur-sm bg-white/10 transition-transform-background duration-500"
        classes={{
          paper: "shadow-lighter rounded-xl",
        }}
      >
        <DialogTitle className="font-public-sans">
          {t("admin.deleteCategory")}
        </DialogTitle>
        <DialogContent>
          <Typography className="font-public-sans">
            {t("admin.deleteCategoryConfirm")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <UIButton variant="soft" size="sm" onClick={handleCloseDeleteDialog}>
            {t("common.cancel")}
          </UIButton>
          <UIButton
            onClick={handleDeleteCategory}
            variant="filled"
            color="error"
            size="sm"
          >
            {t("common.delete")}
          </UIButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
