import { Injector } from '@angular/core';
// used by the router.  This may ago away with the non deprecated router.
let appInjectorRef: Injector;
export const appInjector = (injector?: Injector):Injector => {
    if (injector) {
        appInjectorRef = injector;
    }
    return appInjectorRef;
};