/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DATABASE_HOST: string;
    readonly VITE_DATABASE_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
