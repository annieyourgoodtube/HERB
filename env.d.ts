declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

interface Window {
  aistudio?: {
    hasSelectedApiKey: () => boolean;
    openSelectKey: () => Promise<void>;
  };
}