// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="min-h-[70vh] flex-1">{children}</main>
      </div>
    </div>
  );
}
