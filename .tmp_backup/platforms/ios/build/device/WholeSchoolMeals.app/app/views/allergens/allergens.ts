import { Page } from "ui/page";
import { Observable, EventData, fromObject, PropertyChangeData } from "data/observable";
import { RadListView } from "nativescript-telerik-ui/listview";
import { hasKey, remove, clear } from "application-settings";
import { topmost, goBack } from "ui/frame";
import { Config, Allergen } from '../../shared/models';
import { AllergenList } from '../../view-models/allergens-vm';

var listView;
var allergenList = new AllergenList;
var pageData: Observable = fromObject({
    allergens: allergenList,
    showNextButton: true,
    isLoading: true,
    allergenError: ""
});

export function onNavigatingTo(args: EventData) {
    let page = <Page>args.object;
    let gotData = page.navigationContext;
    console.log(gotData.firstTimeUse);
    onLoaded(args);
}

export function onLoaded(args: EventData) {   
    // Set up the page
    let page = <Page>args.object;
    listView = <RadListView>page.getViewById("listView");

    page.bindingContext=pageData;

    let navContext = page.navigationContext;
    if ( navContext ) {
        pageData.set("showNextButton", !navContext.settings);
    }
        
    // Load allergens
    //allergenList.clear(); //Crashes in iOS
    allergenList.load().then(function() {
        selectAllergens();
        pageData.set("isLoading", false);
        pageData.set("allergenError", "");
    }).catch(error => {
        if (pageData.get("allergens").length > 0) {
            selectAllergens();
            pageData.set("allergenError", "");
        } else {
            let strError: string;
            if (error.toString().includes("offline")) {
                strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
            } else {
                strError = "There appears to be an error with our server, please try again later.";
            }
            pageData.set("allergenError", strError);
        }   
        pageData.set("isLoading", false);
    });
}

function selectAllergens() {
    // 'Select' saved allergens
    pageData.get("allergens").forEach((allergen: Allergen, index: number) => {
        if (allergen.selected) {
            listView.selectItemAt(index);
        }
    });
}

// Save selected allergens
export function onItemSelected(args) {
    let arrAllergens: number[] = [];
    listView.getSelectedItems().forEach((allergen: Allergen) => {
        arrAllergens.push(Number(allergen.id));
    });

    allergenList.myAllergens = arrAllergens;
}

// If the app is running for the first time, go to the next page (when accessed via settings, a back button will be present)
export function goNext() {
    var navigationEntry = {
        moduleName: "views/main/main",
        clearHistory: true
    };
    topmost().navigate(navigationEntry);
}

export function back() {
    goBack();
}

export function navigatedFrom() {
    allergenList.clear();
}