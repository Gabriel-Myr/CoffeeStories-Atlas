
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="pb-24 pt-4 px-5 overflow-y-auto h-full scroll-smooth">
      {children}
    </div>
  );
};

export default Layout;
