﻿/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import "./bundle-config";
import * as app from 'application';
import { hasKey, clear } from "application-settings";
import { Config } from './shared/models';
import { initialize } from "nativescript-image-cache";

// Initialize image caching (Android only)
if (app.android) {
  app.on("launch", () => {
    initialize();
  });
}

// Make sure at least one school has previously been selected (i.e. is this the first use of the app?)
var hasSchools = hasKey(Config.appSettings_mySchools);
if (!hasSchools) {
    app.start({ moduleName: 'views/schools/schools' });
} else {
    app.start({ moduleName: 'views/main/main' });
}

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/