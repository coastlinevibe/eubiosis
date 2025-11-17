'use client';

import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';

const data = {
  facebookLink: 'https://facebook.com/eubiosis-s',
  instaLink: 'https://instagram.com/eubiosis-s',
  twitterLink: 'https://twitter.com/eubiosis-s',
  services: {
    shop: '/eubiosis-s-bottle/size-s/quantity-1',
    ingredients: '/eubiosis-s-bottle/size-s/quantity-1#details',
    usage: '/eubiosis-s-bottle/size-s/quantity-1#details',
    faqs: '/eubiosis-s-bottle/size-s/quantity-1#details',
  },
  about: {
    story: '/about',
    science: '/science',
    testimonials: '/#testimonials',
    gallery: '/#gallery',
  },
  help: {
    support: '/support',
    shipping: '/shipping',
    returns: '/returns',
  },
  contact: {
    email: 'hello@eubiosis-s.com',
    phone: '+27 123 456 789',
    address: 'Mokopane, Limpopo, South Africa',
  },
  company: {
    name: 'Eubiosis-S',
    description: 'Premium honey-based probiotic with 42 bacterial strains. Nature\'s perfect balance for optimal gut health and wellness. Made in South Africa.',
    logo: '/images/bottles/bottle-combo.png',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
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
  { text: 'Customer Support', href: data.help.support },
  { text: 'Shipping Info', href: data.help.shipping },
  { text: 'Returns & Refunds', href: data.help.returns },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function EubiosisSFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-white/30 mt-16 w-full">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
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
                  <Link
                    href={href}
                    className="text-[#4AAE9B] hover:text-[#4AAE9B]/80 transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
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
                    <Link
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800">Product</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-gray-800">Support</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="text-gray-600 hover:text-[#4AAE9B] transition-colors"
                    >
                      {text}
                    </Link>
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}