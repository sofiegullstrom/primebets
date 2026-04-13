
export const openBookmaker = (bookmaker?: string) => {
    const providerUrls: Record<string, string> = {
        'SVS': 'https://www.svenskaspel.se/',
        'SVENSKA SPEL': 'https://www.svenskaspel.se/',
        'LEOVEGAS': 'https://www.leovegas.com/sv-se/',
        'BETMGM': 'https://www.betmgm.se/',
        'BET365': 'https://www.bet365.com/',
        'UNIBET': 'https://www.unibet.se/',
        'ATG': 'https://www.atg.se/',
        'BETFAIR': 'https://www.betfair.se/',
        'PINNACLE': 'https://www.pinnacle.com/',
        'X': 'https://www.atg.se/',
        'EXPEKT': 'https://www.expekt.se/'
    };

    if (bookmaker) {
        const provider = bookmaker.toUpperCase().trim();
        const url = providerUrls[provider] || 'https://www.atg.se/';
        window.open(url, '_blank');
    } else {
        window.open('https://www.atg.se/', '_blank');
    }
};
