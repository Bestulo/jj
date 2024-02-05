// export interface KeplrWindow extends (Window & typeof globalThis) {
//   keplr: any;
// }

export type KeplrWindow = Window &
  typeof globalThis & {
    keplr: any;
  };
