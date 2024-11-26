export interface Country {
    name: string;
    flag: string;
    region: string;
    subregion?: string;
    population?: number;
    capital?: string;
    currencies?: Record<string, { name: string; symbol: string }>[];
    languages?: Record<string, string>;
    timezone?: string[];
    topLevelDomain?: string[];
}
