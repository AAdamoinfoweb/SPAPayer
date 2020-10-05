export enum LivelloBanner  {
  SUCCESS,
  ERROR,
  WARNING,
  INFO
};

export interface BannerType {
  livello: number;
  classe: string;
}
export function getBannerType(bannerType: LivelloBanner): BannerType {
  const BannerType = LivelloBanner;
  switch (bannerType) {
    case BannerType.SUCCESS:
      return {livello: 1, classe: 'alert-success'};
    case BannerType.ERROR:
      return {livello: 2, classe: 'alert-error'};
    case BannerType.WARNING:
      return {livello: 3, classe: 'alert-warning'};
    case BannerType.INFO:
      return {livello: 4, classe: 'alert-info'}
  }
}
