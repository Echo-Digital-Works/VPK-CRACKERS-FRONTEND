import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-brand-darker relative overflow-hidden pt-20 pb-10 border-t border-white/5">
      {/* Animated Top Border Gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <a href="/" className="inline-block" aria-label="Home">
              <img src="/images.png" alt="VPK PREM CRACKERS Logo" width="64" height="64" className="h-16 w-auto object-contain rounded-md bg-white p-1" />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              VPK PREM CRACKERS is a 5-year-old shop supplying premium quality fireworks across Tamil Nadu, Karnataka, and Hyderabad.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-white/10 transition-all">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/vpkpremcrackers?utm_source=qr&igsh=MWJza2o0bzNzNmswOQ==" aria-label="Instagram" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-white/10 transition-all">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-white/10 transition-all">
                <FaTwitter />
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:bg-white/10 transition-all">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Products', 'Location', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-brand-gold transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wider">Categories</h3>
            <ul className="space-y-3">
              {['Sparklers', 'Flower Pots', 'Ground Chakkars', 'Rockets', 'Gift Boxes'].map((item) => (
                <li key={item}>
                  <a href="#products" className="text-gray-400 hover:text-brand-gold transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wider">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for offers and festive updates.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/5 border border-white/10 rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-brand-orange text-sm text-white"
              />
              <button className="bg-gradient-to-r from-brand-gold to-brand-orange px-4 py-2 rounded-r-md text-brand-dark font-semibold text-sm hover:opacity-90 transition-opacity">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm mb-1">
              &copy; {new Date().getFullYear()} VPK PREM CRACKERS. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Developed by <a href="https://echodigitalworks.com" target="_blank" rel="noreferrer" className="text-brand-orange hover:text-brand-gold transition-colors font-semibold">Echo Digital Works</a>
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
