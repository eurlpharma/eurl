import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/store/slices/categorySlice';
import { 
  Box, 
  Typography, 
  Button, 
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
  SelectChangeEvent
} from '@mui/material';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '@/hooks/useNotification';
import { useLocalizedCategories } from '@/hooks/useLocalizedCategory';
import ImageIcon from '@mui/icons-material/Image';
import AIButton from '@/components/buttons/AIButton';

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
  const { categories, loading, error: categoriesError } = useSelector((state: RootState) => state.categories);
  const localizedCategories = useLocalizedCategories(categories || []);

  useEffect(() => {
    dispatch(getCategories() as any);
  }, [dispatch]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    nameFr: '',
    description: '',
    isActive: true,
    image: null as File | null
  });

  const [previewImage, setPreviewImage] = useState<string>('');
  
  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setFormData({
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        nameFr: category.nameFr,
        description: category.description || '',
        isActive: category.isActive,
        image: null
      });
      setSelectedCategory(category);
      if (category.image) {
        setPreviewImage(
          category.image.startsWith('http')
            ? category.image
            : `https://eurl-server.onrender.com/uploads/categories/${category.image}`
        );
      } else {
        setPreviewImage('');
      }
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        nameFr: '',
        description: '',
        isActive: true,
        image: null
      });
      setSelectedCategory(null);
      setPreviewImage('');
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.nameAr.trim()) {
      errors.nameAr = t('validation.required');
    }
    if (!formData.nameEn.trim()) {
      errors.nameEn = t('validation.required');
    }
    if (!formData.nameFr.trim()) {
      errors.nameFr = t('validation.required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveCategory = async () => {
    if (!validateForm()) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nameAr', formData.nameAr);
      formDataToSend.append('nameEn', formData.nameEn);
      formDataToSend.append('nameFr', formData.nameFr);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isActive', formData.isActive.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (selectedCategory) {
        const result = await dispatch(updateCategory({ 
          id: selectedCategory.id, 
          categoryData: formDataToSend 
        }) as any).unwrap();
        
        if (result.image) {
          setPreviewImage(
            result.image.startsWith('http')
              ? result.image
              : `https://eurl-server.onrender.com/uploads/categories/${result.image}`
          );
        }
        
        success(t('admin.categoryUpdated'));
      } else {
        const result = await dispatch(createCategory(formDataToSend) as any).unwrap();
        
        if (result.image) {
          setPreviewImage(
            result.image.startsWith('http')
              ? result.image
              : `https://eurl-server.onrender.com/uploads/categories/${result.image}`
          );
        }
        
        success(t('admin.categoryCreated'));
      }
      
      dispatch(getCategories() as any);
      handleCloseDialog();
    } catch (err: any) {
      error(err?.message || t('error.general'));
    }
  };
  
  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await dispatch(deleteCategory(selectedCategory.id) as any).unwrap();
        success(t('admin.categoryDeleted'));
        handleCloseDeleteDialog();
      } catch (err: any) {
        error(err?.message || t('error.general'));
      }
    }
  };
  
  
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-josefin">
          {t('admin.categories')}
        </Typography>
        <AIButton
          variant="solid"
          radius="full"
          startContent={<PlusIcon className="w-5 h-5" />}
          onClick={() => handleOpenDialog()}
        >
          {t('admin.addCategory')}
        </AIButton>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('categories.image')}</TableCell>
              <TableCell>{t('categories.name')}</TableCell>
              <TableCell>{t('categories.description')}</TableCell>
              <TableCell>{t('categories.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t('loading')}
                </TableCell>
              </TableRow>
            )}
            {categoriesError && (
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ color: 'red' }}>
                  {categoriesError}
                </TableCell>
              </TableRow>
            )}
            {!loading && !categoriesError && localizedCategories && localizedCategories.length > 0 ? (
              localizedCategories.map((category: Category & { localizedName: string }) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <img
                      src={
                        category.image
                          ? category.image.startsWith('http')
                            ? category.image
                            : `https://eurl-server.onrender.com/uploads/categories/${category.image}`
                          : '/images/placeholder.png'
                      }
                      alt={category.localizedName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell>{category.localizedName}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(category)}
                      size="small"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(category)}
                      size="small"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && !categoriesError && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('admin.noCategories')}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog container={document.getElementById("root")} open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? t('admin.editCategory') : t('admin.addCategory')}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label={t('categories.nameAr')}
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              error={!!formErrors.nameAr}
              helperText={formErrors.nameAr}
            />
            <TextField
              fullWidth
              label={t('categories.nameEn')}
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              error={!!formErrors.nameEn}
              helperText={formErrors.nameEn}
            />
            <TextField
              fullWidth
              label={t('categories.nameFr')}
              name="nameFr"
              value={formData.nameFr}
              onChange={handleChange}
              error={!!formErrors.nameFr}
              helperText={formErrors.nameFr}
            />
            <TextField
              fullWidth
              label={t('categories.description')}
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>{t('categories.status')}</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={(e) => handleChange(e as SelectChangeEvent)}
                label={t('categories.status')}
              >
                <MenuItem value="true">{t('common.active')}</MenuItem>
                <MenuItem value="false">{t('common.inactive')}</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle1" className="mb-2">
                {t('categories.image')}
              </Typography>
              <Box
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500"
                onClick={() => document.getElementById('image-upload')?.click()}
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
                  {typeof t('categories.uploadImage') === 'string' ? t('categories.uploadImage') : 'رفع صورة'}
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
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveCategory} variant="contained" color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('admin.deleteCategory')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('admin.deleteCategoryConfirm')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteCategory} variant="contained" color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
