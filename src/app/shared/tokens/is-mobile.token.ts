import { inject, InjectionToken } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

export const IS_MOBILE = new InjectionToken('isMobile', {
  factory() {
    const platform = inject(Platform);
    return platform.IOS || platform.ANDROID
  }
});

export const IS_IOS = new InjectionToken('isIos', {
  factory() {
    const platform = inject(Platform);
    return platform.IOS
  }
});

export const IS_ANDROID = new InjectionToken('isAndroid', {
  factory() {
    const platform = inject(Platform);
    return platform.ANDROID
  }
});
