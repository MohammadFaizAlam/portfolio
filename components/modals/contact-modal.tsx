import { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useLanguage } from "@/providers/language-provider";
import { ArrowUpRight, Calendar, Check, Copy, Mail, Phone } from "lucide-react";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { sanitizePhone } from "@/lib/utils";
import { ShineButton } from "@/components/ui/shine-button";

interface ContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
    const { content, dict } = useLanguage();
    const [copied, setCopied] = useState(false);
    useLenisModal(open);

    const handleCopyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(content.contact.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }, [content.contact.email]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[560px] max-h-[85vh] p-0 gap-0 border-border/60 bg-background/96 backdrop-blur-xl overflow-hidden rounded-2xl"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent z-10" />

                <div className="relative px-7 sm:px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-2.5 text-left">
                        <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-muted-foreground">
                            {content.contact.location} · {content.contact.availability}
                        </span>
                        <DialogTitle className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                            {dict.contactMe}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            {dict.contactModalDescription}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-7 sm:px-8 pb-8 pt-2 flex-1 flex flex-col gap-5" data-lenis-prevent="true">
                    {/* Primary Direct Calendly Action */}
                    <a
                        href={content.contact.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-foreground/25 bg-foreground text-background hover:bg-background hover:text-foreground transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                                    {dict.bookCall}
                                </span>
                                <span className="text-[11px] opacity-75 truncate">
                                    Calendly · 30 min discovery
                                </span>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    {/* Email + One-Click Copy + Phone */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/60 bg-secondary/15">
                            <a
                                href={`mailto:${content.contact.email}`}
                                className="flex items-center gap-3 min-w-0 text-sm text-foreground hover:opacity-75 transition-opacity truncate"
                            >
                                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="truncate font-medium">{content.contact.email}</span>
                            </a>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                aria-label={copied ? dict.emailCopied : dict.copyEmail}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 bg-background/80 hover:bg-foreground hover:text-background text-[11px] font-mono tracking-wider uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        <span>{dict.emailCopied}</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        <span>{dict.copyEmail}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <a
                            href={`tel:${sanitizePhone(content.contact.phone)}`}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/60 bg-secondary/15 hover:border-foreground/30 transition-colors"
                        >
                            <span className="flex items-center gap-3 text-sm text-foreground font-medium tabular-nums">
                                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                {content.contact.phone}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="pt-4 border-t border-border/45 flex flex-wrap gap-2.5 items-center">
                        {content.social.map((link: { label: string; href: string }) => (
                            <ShineButton
                                key={link.label}
                                href={link.href}
                                className="h-9 px-4"
                                shineClassName="w-4 bg-background/20 dark:bg-background/20"
                            >
                                <span className="relative z-10 flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase font-medium whitespace-nowrap">
                                    {link.label}
                                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </ShineButton>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
