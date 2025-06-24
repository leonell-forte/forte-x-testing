declare module '*.css';

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_AMPLITUDE_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_DATOCMS_TOKEN: string;
  readonly VITE_DATOCMS_API_URL: string;
  readonly VITE_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
