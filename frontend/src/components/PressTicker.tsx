

interface Article {
    id: number;
    publication: string;
    headline: string;
    meta: string;
    style: {
        logoFont: string;
        headlineFont: string;
        logoColor: string;
        accent: string;
    };
    url: string;
    logoImage?: string;
}

const articles: Article[] = [
    {
        id: 1,
        publication: 'SPORTBLADET',
        headline: "Drog in 6.8 miljoner: 'Jag är i chock'",
        meta: 'V75 • 2018',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#F6B500]'
        },
        url: 'https://www.aftonbladet.se/sportbladet/trav365/a/b5oWrd/adam-21-drog-in-68-milj-jag-ar-i-chock'
    },
    {
        id: 2,
        publication: 'EXPRESSEN',
        headline: 'Gick golfrunda – drog in 2.4 miljoner',
        meta: 'V75 • 2020',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none text-[#C8102E]',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#C8102E]'
        },
        url: 'https://www.expressen.se/sport/trav/adam-gick-golfrunda-drog-in-24-miljoner/'
    },
    {
        id: 3,
        publication: 'SPORTBLADET',
        headline: 'Satte flera system – spelade in 2.4 miljoner',
        meta: 'V75 • 2020',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#F6B500]'
        },
        url: 'https://www.aftonbladet.se/sportbladet/trav365/a/o3nGoR/storvinster-v75-spelexperten-satte-flera-system-och-spelade-in-24-miljoner'
    },
    {
        id: 4,
        publication: 'EXPRESSEN',
        headline: 'Drog in miljonbelopp – igen',
        meta: 'V75 • 2022',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#1D1D1B]'
        },
        url: 'https://www.expressen.se/sport/trav/adam-25-drog-in-miljonbelopp-igen/'
    },
    {
        id: 5,
        publication: 'SPORTBLADET',
        headline: 'Spelade in 1.2 Mkr på V75 – blev rejält partaj',
        meta: 'V75 • 2019',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#F6B500]'
        },
        url: 'https://www.aftonbladet.se/sportbladet/trav365/a/QMbk9x/adam-spelade-in-12-miljoner-pa-v75-blev-rejalt-partaj'
    },
    {
        id: 6,
        publication: 'EXPRESSEN',
        headline: 'Spelade in mest i landet på V75',
        meta: 'V75 • 2018',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#1D1D1B]'
        },
        url: 'https://www.expressen.se/sport/trav/adam-21-spelade-in-mest-i-landet-pa-v75/'
    },
    {
        id: 7,
        publication: 'SPORTBLADET',
        headline: 'Min superskräll på V75 är helt felspelad',
        meta: 'Experttips',
        style: {
            logoFont: 'font-extrabold italic tracking-wider text-xs font-serif',
            headlineFont: 'font-black uppercase italic leading-none',
            logoColor: 'text-white drop-shadow-md',
            accent: 'bg-[#F6B500]'
        },
        url: 'https://www.aftonbladet.se/sportbladet/trav365/a/eK9MQO/min-superskrall-pa-v75-ar-helt-felspelad'
    },
];

export function PressTicker() {
    return (
        <div className="w-full bg-slate-900 border-y border-white/5 py-6 md:py-8 relative group">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Content */}
            <div className="flex overflow-x-auto px-6 md:px-8 pb-4 gap-4 no-scrollbar snap-x snap-mandatory">
                {articles.map((article) => (
                    <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 snap-center w-[200px] md:w-[240px] bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 text-left relative group/card transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden shadow-lg"
                        style={{
                            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {/* Glass Reflections/Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        {/* Top: Logo Area */}
                        <div className="px-4 py-3 relative z-10 bg-white/5 border-b border-white/5 min-h-[44px] flex items-center">
                            {article.logoImage ? (
                                <img
                                    src={article.logoImage}
                                    alt={article.publication}
                                    className="h-4 md:h-5 object-contain object-left filter brightness-0 invert"
                                />
                            ) : (
                                <span className={`${article.style.logoFont} ${article.style.logoColor} block leading-none text-left text-sm`}>
                                    {article.publication}
                                </span>
                            )}
                        </div>

                        {/* Bottom: Headline */}
                        <div className="px-4 py-4 relative z-10">
                            <h3
                                className="text-sm md:text-[15px] font-medium text-gray-200 leading-snug group-hover/card:text-white transition-colors"
                            >
                                {article.headline}
                            </h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{article.meta}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
