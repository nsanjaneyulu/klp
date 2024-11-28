import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import './app/shared/utils/esa-helpers';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
  disableDebugTools();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
