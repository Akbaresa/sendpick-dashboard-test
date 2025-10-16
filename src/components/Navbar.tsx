'use client';

export default function NavbarPage(){
    return (
        <header className="pc-header">
            <div className="header-wrapper">
                <div className="me-auto pc-mob-drp content-page">
                    <ul className="list-unstyled">
                        <li className="pc-h-item pc-sidebar-collapse">
                        <a href="#" className="pc-head-link ms-0" id="sidebar-hide">
                            <i className="ti ti-menu-2"></i>
                        </a>
                        </li>
                        <li className="pc-h-item pc-sidebar-popup">
                        <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                            <i className="ti ti-menu-2"></i>
                        </a>
                        </li>
                        <li className="pc-h-item d-none d-md-inline-flex">
                        <form className="form-search">
                            <i className="search-icon">
                            <svg className="pc-icon">
                                <use href="#custom-search-normal-1"></use>
                            </svg>
                            </i>
                            <input type="search" className="form-control" placeholder="Ctrl + K" />
                        </form>
                        </li>
                    </ul>
                </div>
                <div className="ms-auto">
                    <ul className="list-unstyled">
                        <li className="dropdown pc-h-item header-user-profile">
                        <a
                            className="pc-head-link dropdown-toggle arrow-none me-0"
                            data-bs-toggle="dropdown"
                            href="#"
                            role="button"
                            aria-haspopup="false"
                            data-bs-auto-close="outside"
                            aria-expanded="false"
                        >
                            <img src="/images/user/avatar-2.jpg" alt="user-image" className="user-avtar" />
                        </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}