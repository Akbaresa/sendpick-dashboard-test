'use client';

import NavbarPage from '@/components/Navbar';
import SideBar from '@/components/Sidebar';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}
    
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
        <SideBar></SideBar>
        <NavbarPage></NavbarPage>
        {children}
    </>
  );
}
