import { Page } from "ui/page";
import { Observable, EventData, fromObject, PropertyChangeData } from "data/observable";
import { RadListView } from "nativescript-telerik-ui/listview";
import { hasKey, setBoolean } from "application-settings";
import { topmost, goBack } from "ui/frame";
import { Config, School } from '../../shared/models';
import { SchoolList } from '../../view-models/schools-vm';
import * as firebase from "nativescript-plugin-firebase";

var listView;
var schoolList = new SchoolList;
var pageData: Observable = fromObject({
    schools: schoolList,
    firstTimeUse: true,
    showNextButton: false,
    isLoading: true,
    schoolError: "",
    auth: ""
});

export function onLoaded(args: EventData) {    
    // Set up the page
    let page = <Page>args.object;
    listView = <RadListView>page.getViewById("listView");

    page.bindingContext=pageData;

    firebase.getCurrentPushToken().then(token => {
        pageData.set("auth", token);
    });
    

    // Double down on hiding the button before checking as it sometimes flashes on
    pageData.set("showNextButton", false);

    let navContext = page.navigationContext;
    if ( navContext ) {
        pageData.set("firstTimeUse", !navContext.settings);
    }
       
    // Load schools
    //schoolList.clear(); //Crashes in iOS
    schoolList.load().then(function() {
        selectSchools();
        pageData.set("isLoading", false);
        pageData.set("schoolError", "");
    }).catch(error => {
        if (pageData.get("schools").length > 0) {
            selectSchools();
            pageData.set("schoolError", "");
        } else {
            let strError: string;
            if (error.toString().includes("offline")) {
                strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
            } else {
                strError = "There appears to be an error with our server, please try again later.";
            }
            pageData.set("schoolError", strError);
        }     
        pageData.set("isLoading", false);
    });
}

function selectSchools() {
    // 'Select' saved schools
    pageData.get("schools").forEach((school: School, index: number) => {
        if (school.selected) {
            listView.selectItemAt(index);
        }
    })
}

// Save selected schools
export function onItemSelected(args) {
    // Create an array to store all selected schools
    let arrSchools: number[] = [];
    
    // If the app is started with no internet and then refreshed through the button, it crashes. This fixes the crash...
    if (!listView) {
        listView = listView = <RadListView>topmost().getViewById("listView");
    }
    
    // Loop through all of the selected items in the RadListView
    listView.getSelectedItems().forEach((school: School) => {
        // Push into the array
        arrSchools.push(Number(school.id));

        // Add a flag to update any notification topic subscriptions
        setBoolean("updateNotificationTopics", true)
    });

    // Send the entire array of selected schools to the view-model
    schoolList.mySchools = arrSchools;
    
    // If there are no saved schools, the app is running for the first time - show a next button once they have selected at least one school
    pageData.set("showNextButton", (pageData.get("firstTimeUse") && arrSchools.length > 0));
}

// If the app is running for the first time, go to the next page (when accessed via settings, a back button will be present)
export function goNext() {
    //topmost().navigate("views/allergens/allergens");
    var navigationEntry = {
        moduleName: "views/allergens/allergens",
        clearHistory: true
    };
    topmost().navigate(navigationEntry);
}

export function back() {
    //goBack();
    var navigationEntry = {
        moduleName: "views/main/main",
        clearHistory: true
    };
    topmost().navigate(navigationEntry);
}

export function navigatedFrom() {
    schoolList.clear();
}