import { EventData } from "data/observable";
import { hasKey } from "application-settings";
import { topmost } from "ui/frame";
import { isIOS, device, platformNames } from "platform";
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import firebase = require("nativescript-plugin-firebase");

export function onLoaded(args: EventData) {   
    if (isIOS) {
        let navigationBar = topmost().ios.controller.navigationBar;
        navigationBar.barStyle = UIBarStyle.Black;
    }

    // Initialize firebase (Notifications)
    firebase.init({
        onPushTokenReceivedCallback: token => {
            console.log("Firebase push token: " + token);
        },
        onMessageReceivedCallback: (message: firebase.Message) => {
            console.log("--- message received: " + message.title + " - " + message.body);
            setTimeout(function () {
                alert({
                    title: (message.title !== undefined ? message.title : ""),
                    message: (message.body !== undefined ? message.body : ""),
                    okButtonText: "Okay"
                });
            }, 3000);
    }}).then(
        (instance) => {
            console.log("firebase.init done");
    },
        (error) => {
            console.log("firebase.init error: " + error);
    });
}

export function openDrawer() {
    let drawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("settings-menu"));
    drawer.gesturesEnabled = true;
    drawer.showDrawer();
}

export function drawerClosed(args) {
    var drawer = args.object;
    drawer.gesturesEnabled = false;
}

export function drawerLoaded(args) {
	var drawer = args.object;
    drawer.gesturesEnabled = false;
	if (!drawer.autoCloseAssigned) {
		drawer.autoCloseAssigned = true;
		drawer.page.on("navigatedFrom", (args) => {
			drawer.closeDrawer();
		});
		
		if (drawer.ios) {
			drawer.ios.defaultSideDrawer.style.shadowMode = 2
			drawer.ios.defaultSideDrawer.style.dimOpacity = 0.12;
            drawer.ios.defaultSideDrawer.style.shadowOpacity = 0.75;
            drawer.ios.defaultSideDrawer.style.shadowRadius = 5;
            drawer.ios.defaultSideDrawer.transitionDuration = 0.25;
		}
	}
}

export function schoolsTap() {
    var navigationEntry = {
        moduleName: "views/schools/schools",
        context: { settings: true },
        animated: false
    };
    topmost().navigate(navigationEntry);
}

export function allergensTap() {
    var navigationEntry = {
        moduleName: "views/allergens/allergens",
        context: { settings: true },
        animated: false
    };
    topmost().navigate(navigationEntry);
}