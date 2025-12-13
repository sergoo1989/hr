export declare class DataStorage {
    private static instance;
    private constructor();
    static getInstance(): DataStorage;
    private ensureDataDirectory;
    saveData(data: any): void;
    loadData(): any | null;
    clearData(): void;
    hasData(): boolean;
}
