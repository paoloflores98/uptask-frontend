import Tabs from '@/components/profile/Tabs';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <>
      <Tabs /> {/* Renderiza el componente */}
      <Outlet />
    </>
  )
}

export default ProfileLayout;