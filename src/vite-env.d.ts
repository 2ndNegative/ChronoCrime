/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dev mode password. Lives in .env.local, which is gitignored; absent in the Pages build. */
  readonly VITE_DEV_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
