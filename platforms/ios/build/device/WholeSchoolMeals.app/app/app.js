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
firebase.init({
    onPushTokenReceivedCallback: function (token) {
        alert(token);
        //console.log("Firebase push token: " + token);
    },
    onMessageReceivedCallback: function (message) {
        console.dir(message);
        alert(message.body);
    }
}).then(function (instance) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUVGLDJCQUF5QjtBQUN6QixpQ0FBbUM7QUFDbkMsNkRBQXFEO0FBQ3JELDBDQUF5QztBQUN6QyxxRUFBc0Q7QUFDdEQsdURBQXlEO0FBRXpELDBDQUEwQztBQUMxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNoQixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNmLHFDQUFVLEVBQUUsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHNDQUFzQztBQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1YsMkJBQTJCLEVBQUUsVUFBQSxLQUFLO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLCtDQUErQztJQUNqRCxDQUFDO0lBQ0QseUJBQXlCLEVBQUUsVUFBQyxPQUF5QjtRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztDQUNKLENBQUMsQ0FBQyxJQUFJLENBQ0gsVUFBQyxRQUFRO0lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsRUFDRCxVQUFDLEtBQUs7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FDSixDQUFDO0FBRUYsc0dBQXNHO0FBQ3RHLElBQUksVUFBVSxHQUFHLDZCQUFNLENBQUMsZUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUFDLElBQUksQ0FBQyxDQUFDO0lBQ0osR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVEOzs7RUFHRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5JbiBOYXRpdmVTY3JpcHQsIHRoZSBhcHAudHMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgdG8geW91ciBhcHBsaWNhdGlvbi5cbllvdSBjYW4gdXNlIHRoaXMgZmlsZSB0byBwZXJmb3JtIGFwcC1sZXZlbCBpbml0aWFsaXphdGlvbiwgYnV0IHRoZSBwcmltYXJ5XG5wdXJwb3NlIG9mIHRoZSBmaWxlIGlzIHRvIHBhc3MgY29udHJvbCB0byB0aGUgYXBw4oCZcyBmaXJzdCBtb2R1bGUuXG4qL1xuXG5pbXBvcnQgXCIuL2J1bmRsZS1jb25maWdcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tICdhcHBsaWNhdGlvbic7XG5pbXBvcnQgeyBoYXNLZXksIGNsZWFyIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuL3NoYXJlZC9tb2RlbHMnO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtaW1hZ2UtY2FjaGVcIjtcbmltcG9ydCAqIGFzIGZpcmViYXNlIGZyb20gXCJuYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlXCI7XG5cbi8vIEluaXRpYWxpemUgaW1hZ2UgY2FjaGluZyAoQW5kcm9pZCBvbmx5KVxuaWYgKGFwcC5hbmRyb2lkKSB7XG4gIGFwcC5vbihcImxhdW5jaFwiLCAoKSA9PiB7XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9KTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBmaXJlYmFzZSAoTm90aWZpY2F0aW9ucylcbmZpcmViYXNlLmluaXQoe1xuICAgIG9uUHVzaFRva2VuUmVjZWl2ZWRDYWxsYmFjazogdG9rZW4gPT4ge1xuICAgICAgYWxlcnQodG9rZW4pO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIkZpcmViYXNlIHB1c2ggdG9rZW46IFwiICsgdG9rZW4pO1xuICAgIH0sXG4gICAgb25NZXNzYWdlUmVjZWl2ZWRDYWxsYmFjazogKG1lc3NhZ2U6IGZpcmViYXNlLk1lc3NhZ2UpID0+IHtcbiAgICAgIGNvbnNvbGUuZGlyKG1lc3NhZ2UpO1xuICAgICAgYWxlcnQobWVzc2FnZS5ib2R5KTtcbiAgICB9XG59KS50aGVuKFxuICAgIChpbnN0YW5jZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGRvbmVcIik7XG4gICAgfSxcbiAgICAoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmlyZWJhc2UuaW5pdCBlcnJvcjogXCIgKyBlcnJvcik7XG4gICAgfVxuKTtcblxuLy8gTWFrZSBzdXJlIGF0IGxlYXN0IG9uZSBzY2hvb2wgaGFzIHByZXZpb3VzbHkgYmVlbiBzZWxlY3RlZCAoaS5lLiBpcyB0aGlzIHRoZSBmaXJzdCB1c2Ugb2YgdGhlIGFwcD8pXG52YXIgaGFzU2Nob29scyA9IGhhc0tleShDb25maWcuYXBwU2V0dGluZ3NfbXlTY2hvb2xzKTtcbmlmICghaGFzU2Nob29scykge1xuICAgIGFwcC5zdGFydCh7IG1vZHVsZU5hbWU6ICd2aWV3cy9zY2hvb2xzL3NjaG9vbHMnIH0pO1xufSBlbHNlIHtcbiAgICBhcHAuc3RhcnQoeyBtb2R1bGVOYW1lOiAndmlld3MvbWFpbi9tYWluJyB9KTtcbn1cblxuLypcbkRvIG5vdCBwbGFjZSBhbnkgY29kZSBhZnRlciB0aGUgYXBwbGljYXRpb24gaGFzIGJlZW4gc3RhcnRlZCBhcyBpdCB3aWxsIG5vdFxuYmUgZXhlY3V0ZWQgb24gaU9TLlxuKi8iXX0=