"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Facebook, Users, Mail } from "lucide-react";

const FACEBOOK_PAGE_URL = "https://www.facebook.com/share/18qJwBFawp/";
const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/2801992786833462/?ref=share&mibextid=NSMWBT";
const WHATSAPP_NUMBER = "01341246069";
const WHATSAPP_URL = `https://wa.me/880${WHATSAPP_NUMBER.slice(1)}`;
const EMAIL = "chemistryunfiltered94@gmail.com";

// lucide-react has no WhatsApp glyph — small inline brand icon instead.
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.04 2C6.499 2 2 6.487 2 12.012c0 1.949.554 3.798 1.554 5.397L2 22l4.795-1.55a10.022 10.022 0 0 0 5.245 1.51h.004c5.541 0 10.04-4.487 10.04-10.012C22.084 6.487 17.585 2 12.04 2zm0 18.198a8.18 8.18 0 0 1-4.166-1.144l-.298-.176-3.097 1.002.985-2.949-.193-.302a8.166 8.166 0 0 1-1.276-4.412c0-4.518 3.704-8.198 8.054-8.198 4.351 0 7.93 3.661 7.93 8.158 0 4.518-3.654 8.021-8.039 8.021z" />
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.347-.385.52-.578.173-.193.232-.331.346-.553.115-.223.073-.408-.024-.566-.099-.149-.6-1.448-.822-1.967-.224-.52-.448-.448-.622-.456-.166-.008-.357-.01-.547-.01-.19 0-.499.07-.762.347-.262.277-1.002.978-1.002 2.387 0 1.408 1.027 2.77 1.166 2.965.14.193 1.974 3.013 4.785 4.104 2.81 1.09 2.81.728 3.318.682.51-.046 1.66-.677 1.894-1.332.234-.654.234-1.215.165-1.332-.07-.116-.297-.182-.595-.331z" />
  </svg>
);

const contactLinks = [
  { icon: Facebook,     label: "Facebook পেজ",            href: FACEBOOK_PAGE_URL },
  { icon: Users,         label: "Facebook গ্রুপ",           href: FACEBOOK_GROUP_URL },
  { icon: WhatsAppIcon,  label: `WhatsApp: ${WHATSAPP_NUMBER}`, href: WHATSAPP_URL },
  { icon: Mail,          label: EMAIL,                      href: `mailto:${EMAIL}` },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <Image src="/logo.png" alt="Chemistry Unfiltered" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-white">Chemistry Unfiltered</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              বাংলাদেশের সবচেয়ে সম্পূর্ণ Chemistry Learning Ecosystem।
              SSC থেকে University পর্যন্ত সব শিক্ষার্থীর জন্য।
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">যোগাযোগ করো</h3>
            <ul className="space-y-3">
              {contactLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-slate-400 hover:text-primary-400 transition-colors group"
                    >
                      <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 flex items-center gap-1">
            © 2024 Chemistry Unfiltered। তৈরি করা হয়েছে{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" />
            দিয়ে বাংলাদেশে
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              ব্যবহারের শর্ত
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
