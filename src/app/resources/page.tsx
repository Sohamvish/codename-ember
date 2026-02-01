"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Phone, ExternalLink, ShieldAlert, HeartHandshake, Globe } from "lucide-react";

export default function ResourcesPage() {

    const emergencyContacts = [
        {
            name: "988 Suicide & Crisis Lifeline",
            number: "988",
            link: "tel:988",
            desc: "24/7 suicide prevention and crisis support."
        },
        {
            name: "National Domestic Violence Hotline",
            number: "1-800-799-7233",
            link: "tel:18007997233",
            desc: "24/7 confidential support for domestic violence."
        },
        {
            name: "Crisis Text Line",
            number: "Text HOME to 741741",
            link: "sms:741741&body=HOME",
            desc: "Free, 24/7 crisis support via text."
        },
        {
            name: "RAINN (Sexual Assault Hotline)",
            number: "1-800-656-4673",
            link: "tel:18006564673",
            desc: "Confidential sexual assault support."
        },
    ];

    const webResources = [
        {
            name: "RAINN - Rape, Abuse & Incest National Network",
            url: "https://www.rainn.org",
            desc: "Resources for survivors of sexual violence"
        },
        {
            name: "National Domestic Violence Hotline",
            url: "https://www.thehotline.org",
            desc: "Information and support for domestic violence"
        },
        {
            name: "Love Is Respect",
            url: "https://www.loveisrespect.org",
            desc: "Resources for healthy relationships and dating abuse"
        },
        {
            name: "Crisis Text Line",
            url: "https://www.crisistextline.org",
            desc: "Free crisis support via text message"
        },
        {
            name: "National Alliance on Mental Illness (NAMI)",
            url: "https://www.nami.org",
            desc: "Mental health resources and support groups"
        }
    ];

    return (
        <div className="min-h-screen p-4 pt-12 max-w-xl mx-auto space-y-8">

            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-stone-200">Safety & Support</h1>
                <p className="text-stone-400">You are not alone. Help is available.</p>
            </header>

            {/* Quick Exit Tip */}
            <GlassCard className="border-l-4 border-l-red-500 bg-red-900/10">
                <div className="flex gap-4">
                    <ShieldAlert className="text-red-400 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-red-200">Safety Tip</h3>
                        <p className="text-sm text-stone-400 mt-1">If you feel unsafe, close this tab immediately and clear your browser history if necessary. Press ESC to quickly exit.</p>
                    </div>
                </div>
            </GlassCard>

            {/* Emergency Numbers */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-ember-glow flex items-center gap-2">
                    <Phone size={20} />
                    Immediate Help
                </h2>
                <div className="grid gap-3">
                    {emergencyContacts.map((contact, i) => (
                        <a
                            key={i}
                            href={contact.link}
                            className="block"
                        >
                            <GlassCard className="flex items-center justify-between p-4 group cursor-pointer hover:bg-stone-800/50 transition-all hover:border-ember/30">
                                <div>
                                    <h3 className="font-medium text-stone-200">{contact.name}</h3>
                                    <p className="text-xs text-stone-500">{contact.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 text-ember group-hover:underline">
                                    <span className="font-mono text-sm">{contact.number}</span>
                                    <Phone size={14} />
                                </div>
                            </GlassCard>
                        </a>
                    ))}
                </div>
            </section>

            {/* Web Resources */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                    <Globe size={20} />
                    Online Resources
                </h2>
                <div className="grid gap-3">
                    {webResources.map((resource, i) => (
                        <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <GlassCard className="flex items-center justify-between p-4 group cursor-pointer hover:bg-stone-800/50 transition-all hover:border-blue-400/30">
                                <div className="flex-1">
                                    <h3 className="font-medium text-stone-200 group-hover:text-blue-300 transition-colors">{resource.name}</h3>
                                    <p className="text-xs text-stone-500">{resource.desc}</p>
                                </div>
                                <ExternalLink size={16} className="text-blue-400 flex-shrink-0 ml-2" />
                            </GlassCard>
                        </a>
                    ))}
                </div>
            </section>

            {/* Community Resources */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-teal-400 flex items-center gap-2">
                    <HeartHandshake size={20} />
                    Community & Healing
                </h2>
                <GlassCard className="space-y-4">
                    <p className="text-sm text-stone-300 leading-relaxed">
                        Connect with local women's shelters, therapy groups, and legal aid clinics. We are building a directory of trusted partners.
                    </p>
                    <a
                        href="https://www.thehotline.org/get-help/domestic-violence-local-resources/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 rounded-xl bg-teal-500/10 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors text-center"
                    >
                        Find Local Resources
                    </a>
                </GlassCard>
            </section>

            <div className="h-20" />
        </div>
    );
}
