'use client';
import { useAuth } from '@/core/hooks/useAuth';
import { AuthUser } from '@/core/types';
import { User } from '@/core/types/user';
import { IconLayout } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';

interface MenuItemType {
  title: string;
  href: string;
  icon: JSX.Element;
  submenu?: MenuItemType[];
}

export default function SideBar() {
  const pathname = usePathname();
  const { checkToken } = useAuth();

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await checkToken();
        setUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const menuItems: MenuItemType[] = [
    { title: 'Job Order', href: '/job-order', icon: <IconLayout size={20} /> },
  ];


  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        <div className="m-header">
          <Link href="/dashboard" className="b-brand text-primary">
            <Image width={40} height={10} src="/images/logo-dark.svg" className="img-fluid logo-lg" alt="logo" />
            <span className="badge bg-light-success rounded-pill ms-2 theme-version">v9.5.0</span>
          </Link>
        </div>
        <div className="navbar-content">
          <div className="card pc-user-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <Image width={42} height={42} src="/images/user/avatar-1.jpg" alt="user-image" className="user-avtar wid-45 rounded-circle" />
                </div>
                <div className="flex-grow-1 ms-3 me-2">
                  <h6 className="mb-0" >{user?.name}</h6>
                  <small data-i18n="Administrator">Administrator</small>
                </div>
                <a className="btn btn-icon btn-link-secondary avtar" data-bs-toggle="collapse" href="#pc_sidebar_userlink">
                  <svg className="pc-icon">
                    <use href="#custom-sort-outline"></use>
                  </svg>
                </a>
              </div>
            </div>
          </div>

            <ul>
              {menuItems.map((menuItem) => {
                const isActive = pathname.startsWith(menuItem.href);

                return (
                  <li
                    key={menuItem.href}
                    className={`pc-item rounded mx-2 mt-1`}
                    style={{
                      background: isActive ? '#dce1f3' : 'transparent', 
                      transition: 'background 0.3s ease',
                    }}
                  >
                    <Link
                      href={menuItem.href}
                      className="pc-link d-flex align-items-center"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span
                        className="pc-micon d-flex align-items-center justify-content-center"
                        style={{
                          color: isActive ? '#4d70e0' : '#555',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '10px',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {menuItem.icon}
                      </span>

                      <span
                        className="pc-mtext fw-semibold"
                        style={{
                          color: isActive ? '#2352ee' : '#888888',
                          transition: 'color 0.3s ease',
                        }}
                        data-i18n={menuItem.title}
                      >
                        {menuItem.title}
                      </span>
                    </Link>

                    <style jsx>{`
                      li.pc-item a.pc-link:hover .pc-micon {
                        color: #4b6cb7;
                      }
                      li.pc-item a.pc-link:hover .pc-mtext {
                        color: #4b6cb7;
                      }
                      li.pc-item a.pc-link:hover {
                        background: #b1adad;
                      }
                    `}</style>
                  </li>
                );
              })}
            </ul>

        </div>
      </div >
    </nav >
    
  );
}
