interface MaxWebApp {
  ready: () => void;
}

declare global {
  var WebApp: MaxWebApp | undefined;
}

export const notifyMaxAppReady = (): void => {
  globalThis.WebApp?.ready();
};

export {};
