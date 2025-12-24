'use client';

import {
  Mail,
  MapPin,
  Phone,
  Facebook,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const data = {
  facebookLink: 'https://www.facebook.com/share/1AEhMdUjsn/',
  services: {
    shop: '/shop',
    ingredients: 'key-ingredients',
    usage: '/shop',
    faqs: '/shop',
  },
  about: {
    story: 'what-is-eubiosis-s',
    science: 'key-ingredients',
    testimonials: 'testimonials',
    gallery: 'gallery',
  },
  help: {
    support: 'whatsapp://send?phone=270714329190',
    shipping: 'shipping-info',
  },
  contact: {
    email: 'eubiosis@outlook.com',
    phone: '0714329190',
    address: 'Mokopane, Limpopo, South Africa',
  },
  shipping: {
    info: 'Same-day delivery in Mokopane area. Nationwide shipping available via Courier Guy.',
  },
  company: {
    name: 'Eubiosis-S',
    description: 'Premium honey-based probiotic with 42 bacterial strains. Nature\'s perfect balance for optimal gut health and wellness. Made in South Africa.',
    logo: '/images/bottles/bottle-combo.png',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
];

const aboutLinks = [
  { text: 'Our Story', href: data.about.story },
  { text: 'The Science', href: data.about.science },
  { text: 'Testimonials', href: data.about.testimonials },
  { text: 'Gallery', href: data.about.gallery },
];

const serviceLinks = [
  { text: 'Shop Now', href: data.services.shop },
  { text: 'Ingredients', href: data.services.ingredients },
  { text: 'How to Use', href: data.services.usage },
  { text: 'FAQs', href: data.services.faqs },
];

const helpfulLinks = [
  { text: 'WhatsApp Support', href: data.help.support },
  { text: 'Shipping Info', href: data.help.shipping },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function EubiosisSFooter() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    if (href.startsWith('whatsapp://')) {
      // Open WhatsApp directly
      window.open(href, '_blank');
    } else if (href === 'shipping-info') {
      // Shipping info is already visible in footer, just scroll to it
      const element = document.querySelector('.text-center.lg\\:text-left');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (href === '/') {
      router.push('/');
    } else if (href.startsWith('/#')) {
      // For hash links, go to home page first then scroll
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(2));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (href.startsWith('/')) {
      // Regular page navigation
      router.push(href);
    } else {
      // Section navigation - go to home page first, then scroll to section
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-white/30 mt-16 w-full">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-32 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-3 sm:justify-start items-center">
              <img
                src={data.company.logo}
                alt="Eubiosis-S Logo"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="text-2xl font-semibold text-[#4AAE9B]">
                {data.company.name}
              </span>
            </div>
            <p className="text-gray-600 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <button
                    className="text-[#4AAE9B] hover:text-[#4AAE9B]/80 transition-colors"
                    onClick={() => {
                      if (href === '#') {
                        alert(`${label} coming soon!`);
                      } else {
                        window.open(href, '_blank');
                      }
                    }}
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <button
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors text-left"
                      onClick={() => handleNavigation(href)}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800">Product</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <button
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors text-left"
                      onClick={() => handleNavigation(href)}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800">Support</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <button
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors text-left"
                      onClick={() => handleNavigation(href)}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <p className="text-lg font-medium text-gray-800 mb-4">Contact Us</p>
              <ul className="space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <Icon className="text-[#4AAE9B] size-5 shrink-0" />
                      {isAddress ? (
                        <address className="text-gray-600 not-italic">
                          {text}
                        </address>
                      ) : (
                        <span className="text-gray-600">{text}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Shipping Information */}
              <div className="mt-6 pt-4 border-t border-gray-200 mb-4">
                <p className="text-sm font-medium text-gray-800 mb-2">Shipping</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {data.shipping.info}
                </p>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-sm text-gray-500 mb-2">
                <span className="block">All rights reserved.</span>
              </p>
              <p className="text-gray-600 text-sm">
                &copy; 2025 {data.company.name} - Nature in a Bottle
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Made with ❤️ in South Africa
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Powered by <a href="https://wabi-sabi.click" target="_blank" rel="noopener noreferrer" className="text-[#4AAE9B] hover:text-[#4AAE9B]/80 transition-colors font-medium">Wabi-sabi Systems</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}