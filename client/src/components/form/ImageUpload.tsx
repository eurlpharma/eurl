import React, { useCallback } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { IconGallery, IconTrashBold } from '../Iconify';

interface ImageUploadProps {
  images: File[];
  imageUrls: string[];
  onImagesChange: (images: File[]) => void;
  onImageUrlsChange: (urls: string[]) => void;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  imageUrls,
  onImagesChange,
  onImageUrlsChange,
  maxFiles = 5
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      alert(`You can upload ${maxFiles} files max`);
      return;
    }
    onImagesChange([...images, ...acceptedFiles]);
  }, [images, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - images.length
  });

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const handleRemoveImageUrl = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    onImageUrlsChange(newImageUrls);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed #919eab33',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : '#919eab14',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 font-public-sans">
          
        <input {...getInputProps()} />
        <IconGallery className='w-20 h-20' />
        <Typography variant="body1" color="text.secondary">
          {isDragActive
            ? 'Drag images here..'
            : 'Drag images here or click to select'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          (You can upload {maxFiles} max files)
        </Typography>
        </div>

      </Box>

      {(images.length > 0 || imageUrls.length > 0) && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {imageUrls.map((url, index) => (
            <Grid item key={`url-${index}`}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImageUrl(index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <IconTrashBold className="text-girl-secondary" />
                </IconButton>
              </Box>
            </Grid>
          ))}
          {images.map((file, index) => (
            <Grid item key={`file-${index}`}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <IconTrashBold className="text-girl-secondary" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ImageUpload; 