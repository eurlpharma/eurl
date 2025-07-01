import { useTranslation } from 'react-i18next';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminSidebar = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('admin.settings'),
      path: '/admin/settings',
      icon: <SettingsIcon />
    }
  ];

  return (
    // Your sidebar JSX here
    <div>
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.icon}
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default AdminSidebar; 