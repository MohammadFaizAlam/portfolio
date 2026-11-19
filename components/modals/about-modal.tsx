import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useLanguage } from "@/providers/language-provider";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { RichText } from "@/lib/markdown";

interface AboutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
    const { content, dict } = useLanguage();
    useLenisModal(open);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[640px] max-h-[85vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-2 text-left">
                        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                            Mohammed Faiz Alam · Mumbai, India
                        </span>
                        <DialogTitle className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                            {dict.title.about}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-2 flex-1" data-lenis-prevent="true">
                    <div className="flex flex-col gap-6">
                        <div className="text-sm sm:text-[15px] text-foreground/85 leading-relaxed font-light whitespace-pre-line">
                            <RichText>{content.about.full}</RichText>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
