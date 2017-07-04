import { topmost, goBack } from "ui/frame";

export function back() {
    goBack();
}

export function schools() {
    var navigationEntry = {
        moduleName: "views/schools/schools",
        context: { settings: true },
        animated: false
    };
    topmost().navigate(navigationEntry);
}

export function allergens() {
    var navigationEntry = {
        moduleName: "views/allergens/allergens",
        context: { settings: true },
        animated: false
    };
    topmost().navigate(navigationEntry);
}