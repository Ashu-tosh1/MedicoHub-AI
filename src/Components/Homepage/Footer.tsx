// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-6">
      <p className="text-sm">&copy; {new Date().getFullYear()} MedicoHub. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
