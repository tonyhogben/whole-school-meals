/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./bundle-config");
var app = require("application");
var application_settings_1 = require("application-settings");
var models_1 = require("./shared/models");
var nativescript_image_cache_1 = require("nativescript-image-cache");
var firebase = require("nativescript-plugin-firebase");
// Initialize image caching (Android only)
if (app.android) {
    app.on("launch", function () {
        nativescript_image_cache_1.initialize();
    });
}
// Initialize firebase (Notifications)
firebase.init({}).then(function (instance) {
    console.log("firebase.init done");
}, function (error) {
    console.log("firebase.init error: " + error);
});
// Make sure at least one school has previously been selected (i.e. is this the first use of the app?)
var hasSchools = application_settings_1.hasKey(models_1.Config.appSettings_mySchools);
if (!hasSchools) {
    app.start({ moduleName: 'views/schools/schools' });
}
else {
    app.start({ moduleName: 'views/main/main' });
}
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUVGLDJCQUF5QjtBQUN6QixpQ0FBbUM7QUFDbkMsNkRBQXFEO0FBQ3JELDBDQUF5QztBQUN6QyxxRUFBc0Q7QUFDdEQsdURBQTBEO0FBRTFELDBDQUEwQztBQUMxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNoQixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNmLHFDQUFVLEVBQUUsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHNDQUFzQztBQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBR2IsQ0FBQyxDQUFDLElBQUksQ0FDTCxVQUFDLFFBQVE7SUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxFQUNELFVBQUMsS0FBSztJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUNGLENBQUM7QUFFRixzR0FBc0c7QUFDdEcsSUFBSSxVQUFVLEdBQUcsNkJBQU0sQ0FBQyxlQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDZCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBQUMsSUFBSSxDQUFDLENBQUM7SUFDSixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7OztFQUdFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkluIE5hdGl2ZVNjcmlwdCwgdGhlIGFwcC50cyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCB0byB5b3VyIGFwcGxpY2F0aW9uLlxuWW91IGNhbiB1c2UgdGhpcyBmaWxlIHRvIHBlcmZvcm0gYXBwLWxldmVsIGluaXRpYWxpemF0aW9uLCBidXQgdGhlIHByaW1hcnlcbnB1cnBvc2Ugb2YgdGhlIGZpbGUgaXMgdG8gcGFzcyBjb250cm9sIHRvIHRoZSBhcHDigJlzIGZpcnN0IG1vZHVsZS5cbiovXG5cbmltcG9ydCBcIi4vYnVuZGxlLWNvbmZpZ1wiO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gJ2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IGhhc0tleSwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1pbWFnZS1jYWNoZVwiO1xuaW1wb3J0IGZpcmViYXNlID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2VcIik7XG5cbi8vIEluaXRpYWxpemUgaW1hZ2UgY2FjaGluZyAoQW5kcm9pZCBvbmx5KVxuaWYgKGFwcC5hbmRyb2lkKSB7XG4gIGFwcC5vbihcImxhdW5jaFwiLCAoKSA9PiB7XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9KTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBmaXJlYmFzZSAoTm90aWZpY2F0aW9ucylcbmZpcmViYXNlLmluaXQoe1xuICAvLyBPcHRpb25hbGx5IHBhc3MgaW4gcHJvcGVydGllcyBmb3IgZGF0YWJhc2UsIGF1dGhlbnRpY2F0aW9uIGFuZCBjbG91ZCBtZXNzYWdpbmcsXG4gIC8vIHNlZSB0aGVpciByZXNwZWN0aXZlIGRvY3MuXG59KS50aGVuKFxuICAoaW5zdGFuY2UpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcbiAgfSxcbiAgKGVycm9yKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGVycm9yOiBcIiArIGVycm9yKTtcbiAgfVxuKTtcblxuLy8gTWFrZSBzdXJlIGF0IGxlYXN0IG9uZSBzY2hvb2wgaGFzIHByZXZpb3VzbHkgYmVlbiBzZWxlY3RlZCAoaS5lLiBpcyB0aGlzIHRoZSBmaXJzdCB1c2Ugb2YgdGhlIGFwcD8pXG52YXIgaGFzU2Nob29scyA9IGhhc0tleShDb25maWcuYXBwU2V0dGluZ3NfbXlTY2hvb2xzKTtcbmlmICghaGFzU2Nob29scykge1xuICAgIGFwcC5zdGFydCh7IG1vZHVsZU5hbWU6ICd2aWV3cy9zY2hvb2xzL3NjaG9vbHMnIH0pO1xufSBlbHNlIHtcbiAgICBhcHAuc3RhcnQoeyBtb2R1bGVOYW1lOiAndmlld3MvbWFpbi9tYWluJyB9KTtcbn1cblxuLypcbkRvIG5vdCBwbGFjZSBhbnkgY29kZSBhZnRlciB0aGUgYXBwbGljYXRpb24gaGFzIGJlZW4gc3RhcnRlZCBhcyBpdCB3aWxsIG5vdFxuYmUgZXhlY3V0ZWQgb24gaU9TLlxuKi8iXX0=