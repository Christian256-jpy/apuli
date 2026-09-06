import { MessageCircle } from "lucide-react";
import { browseMessage, whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(browseMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 min-w-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:scale-105 md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
