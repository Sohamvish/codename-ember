import { EmberChat } from "@/components/EmberChat";
import { CandleFlame } from "@/components/ui/CandleFlame";

export default function EmberPage() {
    return (
        <div className="min-h-screen p-4 pt-12 md:pt-16 max-w-4xl mx-auto flex flex-col items-center justify-center">
            <div className="mb-8 text-center space-y-2">
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <CandleFlame size="lg" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-ember to-orange-500 bg-clip-text text-transparent">Ember</h1>
                <p className="text-stone-400 max-w-sm mx-auto">A safe space to unravel your thoughts. No judgment, just presence.</p>
            </div>

            <EmberChat />
        </div>
    );
}
