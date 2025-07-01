import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '@/hooks/useNotification';
import { getUsers, updateUser, addUserAdmin, updateUserStatus, deleteUser } from '@/api/users';
import moment from "moment"
import AIButton from '@/components/buttons/AIButton';

// Página de administración de usuarios
const UsersPage = () => {
  const { t } = useTranslation();
  const { success } = useNotification();
  
  // Estado para la tabla
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para diálogos
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Datos de ejemplo para la tabla de usuarios
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado del formulario de edición
  const [formData, setFormData] = useState({
    role: '',
    isActive: true
  });
  
  // حالة نافذة إضافة مستخدم جديد
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  
  // Filtrar usuarios por término de búsqueda
  const filteredUsers = users.filter((user: any) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejadores de eventos para la paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Manejadores para el diálogo de edición
  const handleOpenEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      role: user.role,
      isActive: user.isActive
    });
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  // Manejadores para el diálogo de eliminación
  const handleOpenDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  
  // Guardar cambios del usuario
  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        const promises = [];
        if (formData.role !== selectedUser.role) {
          promises.push(updateUser(selectedUser._id, { role: formData.role as 'user' | 'admin' }));
        }
        if (formData.isActive !== selectedUser.isActive) {
          promises.push(updateUserStatus(selectedUser._id, { isActive: formData.isActive }));
        }
        if (promises.length > 0) {
          await Promise.all(promises);
        }
        const data = await getUsers(page + 1, rowsPerPage);
        setUsers(data.users || data);
        success(t('admin.userUpdated'));
        handleCloseEditDialog();
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء تحديث حالة المستخدم');
      }
    }
  };
  
  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (selectedUser && (selectedUser._id || selectedUser.id)) {
      try {
        await deleteUser(selectedUser._id || selectedUser.id);
        setUsers(users.filter((user: any) => (user._id || user.id) !== (selectedUser._id || selectedUser.id)));
        success(t('admin.userDeleted'));
        handleCloseDeleteDialog();
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء حذف المستخدم');
      }
    } else {
      setError('لا يوجد معرف للمستخدم المراد حذفه');
    }
  };
  
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setAddForm({ name: '', email: '', password: '', role: 'user' });
  };
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setAddForm({ ...addForm, [name!]: value });
  };
  const handleAddUser = async () => {
    try {
      await addUserAdmin({
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role,
      });
      // إعادة جلب المستخدمين من السيرفر بعد الإضافة
      const data = await getUsers(page + 1, rowsPerPage);
      setUsers(data.users || data);
      handleCloseAddDialog();
      success(t('admin.userAdded'));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة المستخدم');
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers(page + 1, rowsPerPage);
        setUsers(data.users || data); // حسب شكل الاستجابة
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, rowsPerPage]);
  
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-josefin">
          {t('admin.users')}
        </Typography>
        <AIButton
          variant="solid"
          startContent={<UserPlusIcon className="w-5 h-5" />}
          onClick={handleOpenAddDialog}
        >
          {t('admin.addUser')}
        </AIButton>
      </Box>
      
      {/* Barra de búsqueda */}
      <Box className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('common.searchUsers')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Tabla de usuarios */}
      {loading ? (
        <Box className="flex items-center justify-center p-8">
          <Typography>{t('common.loading')}</Typography>
        </Box>
      ) : error ? (
        <Box className="flex items-center justify-center p-8">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.user')}</TableCell>
                <TableCell>{t('users.email')}</TableCell>
                <TableCell>{t('users.role')}</TableCell>
                <TableCell>{t('users.status')}</TableCell>
                <TableCell>{t('users.createdAt')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user: any, idx: number) => (
                  <TableRow key={user._id || user.id || user.email || idx}>
                    <TableCell>
                      <Box className="flex items-center">
                        <Avatar 
                          className="mr-2"
                          alt={user.name}
                          src="/images/product-placeholder.svg"
                        />
                        <Typography variant="body2">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={t(`users.roles.${String(user.role).toLowerCase()}`)} 
                        color={user.role === 'admin' ? 'primary' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? t('common.active') : t('common.inactive')} 
                        color={user.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell className="uppercase">{moment(user.createdAt).format("DD MMM YYYY")}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user)}
                        disabled={user.role === 'admin'} // No permitir eliminar administradores
                      >
                        <TrashIcon className="w-5 h-5" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>
      )}
      
      {/* Diálogo para editar usuario */}
      <Dialog container={() => document.getElementById('root')} open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('admin.editUser')}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box className="pt-2 space-y-4">
              <Box className="flex items-center mb-4">
                <Avatar 
                  className="mr-3"
                  alt={selectedUser.name}
                  src="/images/product-placeholder.svg"
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>{t('users.role')}</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      role: event.target.value,
                    });
                  }}
                  label={t('users.role')}
                >
                  <MenuItem value="admin">{t('users.roles.admin')}</MenuItem>
                  <MenuItem value="user">{t('users.roles.user')}</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>{t('users.status')}</InputLabel>
                <Select
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      isActive: event.target.value === "true",
                    });
                  }}
                  label={t('users.status')}
                >
                  <MenuItem value="true">{t('common.active')}</MenuItem>
                  <MenuItem value="false">{t('common.inactive')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            {t('common.cancel')}
          </Button>
          <AIButton onClick={handleSaveUser}  variant="solid">
            {t('common.save')}
          </AIButton>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        container={() => document.getElementById('root')}
      >
        <DialogTitle>{t('admin.deleteUserTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.deleteUserConfirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog إضافة مستخدم جديد */}
      <Dialog container={() => document.getElementById('root')} open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('admin.addUser')}</DialogTitle>
        <DialogContent>
          <Box className="pt-2 space-y-4">
            <TextField
              label={t('users.name')}
              name="name"
              value={addForm.name}
              onChange={handleAddFormChange}
              fullWidth
              required
            />
            <TextField
              label={t('users.email')}
              name="email"
              value={addForm.email}
              onChange={handleAddFormChange}
              fullWidth
              required
              type="email"
            />
            <TextField
              label={t('users.password')}
              name="password"
              value={addForm.password}
              onChange={handleAddFormChange}
              fullWidth
              required
              type="password"
            />
            <FormControl fullWidth>
              <InputLabel>{t('users.role')}</InputLabel>
              <Select
                name="role"
                value={addForm.role}
                onChange={(event) => {
                  handleAddFormChange({
                    target: {
                      name: "role",
                      value: event.target.value,
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                label={t('users.role')}
              >
                <MenuItem value="admin">{t('users.roles.admin')}</MenuItem>
                <MenuItem value="user">{t('users.roles.user')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained" disabled={!addForm.name || !addForm.email || !addForm.password}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
