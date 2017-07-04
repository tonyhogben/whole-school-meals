"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var application_settings_1 = require("application-settings");
var frame_1 = require("ui/frame");
var schools_vm_1 = require("../../view-models/schools-vm");
var firebase = require("nativescript-plugin-firebase");
var listView;
var schoolList = new schools_vm_1.SchoolList;
var pageData = observable_1.fromObject({
    schools: schoolList,
    firstTimeUse: true,
    showNextButton: false,
    isLoading: true,
    schoolError: "",
    auth: ""
});
function onLoaded(args) {
    // Set up the page
    var page = args.object;
    listView = page.getViewById("listView");
    page.bindingContext = pageData;
    firebase.getCurrentPushToken().then(function (token) {
        pageData.set("auth", token);
    });
    // Double down on hiding the button before checking as it sometimes flashes on
    pageData.set("showNextButton", false);
    var navContext = page.navigationContext;
    if (navContext) {
        pageData.set("firstTimeUse", !navContext.settings);
    }
    // Load schools
    //schoolList.clear(); //Crashes in iOS
    schoolList.load().then(function () {
        selectSchools();
        pageData.set("isLoading", false);
        pageData.set("schoolError", "");
    }).catch(function (error) {
        if (pageData.get("schools").length > 0) {
            selectSchools();
            pageData.set("schoolError", "");
        }
        else {
            var strError = void 0;
            if (error.toString().includes("offline")) {
                strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
            }
            else {
                strError = "There appears to be an error with our server, please try again later.";
            }
            pageData.set("schoolError", strError);
        }
        pageData.set("isLoading", false);
    });
}
exports.onLoaded = onLoaded;
function selectSchools() {
    // 'Select' saved schools
    pageData.get("schools").forEach(function (school, index) {
        if (school.selected) {
            listView.selectItemAt(index);
        }
    });
}
// Save selected schools
function onItemSelected(args) {
    // Create an array to store all selected schools
    var arrSchools = [];
    // If the app is started with no internet and then refreshed through the button, it crashes. This fixes the crash...
    if (!listView) {
        listView = listView = frame_1.topmost().getViewById("listView");
    }
    // Loop through all of the selected items in the RadListView
    listView.getSelectedItems().forEach(function (school) {
        // Push into the array
        arrSchools.push(Number(school.id));
        // Add a flag to update any notification topic subscriptions
        application_settings_1.setBoolean("updateNotificationTopics", true);
    });
    // Send the entire array of selected schools to the view-model
    schoolList.mySchools = arrSchools;
    // If there are no saved schools, the app is running for the first time - show a next button once they have selected at least one school
    pageData.set("showNextButton", (pageData.get("firstTimeUse") && arrSchools.length > 0));
}
exports.onItemSelected = onItemSelected;
// If the app is running for the first time, go to the next page (when accessed via settings, a back button will be present)
function goNext() {
    //topmost().navigate("views/allergens/allergens");
    var navigationEntry = {
        moduleName: "views/allergens/allergens",
        clearHistory: true
    };
    frame_1.topmost().navigate(navigationEntry);
}
exports.goNext = goNext;
function back() {
    //goBack();
    var navigationEntry = {
        moduleName: "views/main/main",
        clearHistory: true
    };
    frame_1.topmost().navigate(navigationEntry);
}
exports.back = back;
function navigatedFrom() {
    schoolList.clear();
}
exports.navigatedFrom = navigatedFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBd0Y7QUFFeEYsNkRBQTBEO0FBQzFELGtDQUEyQztBQUUzQywyREFBMEQ7QUFDMUQsdURBQXlEO0FBRXpELElBQUksUUFBUSxDQUFDO0FBQ2IsSUFBSSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFlLHVCQUFVLENBQUM7SUFDbEMsT0FBTyxFQUFFLFVBQVU7SUFDbkIsWUFBWSxFQUFFLElBQUk7SUFDbEIsY0FBYyxFQUFFLEtBQUs7SUFDckIsU0FBUyxFQUFFLElBQUk7SUFDZixXQUFXLEVBQUUsRUFBRTtJQUNmLElBQUksRUFBRSxFQUFFO0NBQ1gsQ0FBQyxDQUFDO0FBRUgsa0JBQXlCLElBQWU7SUFDcEMsa0JBQWtCO0lBQ2xCLElBQUksSUFBSSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsUUFBUSxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJELElBQUksQ0FBQyxjQUFjLEdBQUMsUUFBUSxDQUFDO0lBRTdCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUs7UUFDckMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFHSCw4RUFBOEU7SUFDOUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV0QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUUsVUFBVyxDQUFDLENBQUMsQ0FBQztRQUNmLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxlQUFlO0lBQ2Ysc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbkIsYUFBYSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztRQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsYUFBYSxFQUFFLENBQUM7WUFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxRQUFRLFNBQVEsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxHQUFHLDRGQUE0RixDQUFDO1lBQzVHLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFRLEdBQUcsdUVBQXVFLENBQUM7WUFDdkYsQ0FBQztZQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUF6Q0QsNEJBeUNDO0FBRUQ7SUFDSSx5QkFBeUI7SUFDekIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjLEVBQUUsS0FBYTtRQUMxRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQixRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCx3QkFBd0I7QUFDeEIsd0JBQStCLElBQUk7SUFDL0IsZ0RBQWdEO0lBQ2hELElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUU5QixvSEFBb0g7SUFDcEgsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ1osUUFBUSxHQUFHLFFBQVEsR0FBZ0IsZUFBTyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCw0REFBNEQ7SUFDNUQsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBYztRQUMvQyxzQkFBc0I7UUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkMsNERBQTREO1FBQzVELGlDQUFVLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCw4REFBOEQ7SUFDOUQsVUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7SUFFbEMsd0lBQXdJO0lBQ3hJLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RixDQUFDO0FBdkJELHdDQXVCQztBQUVELDRIQUE0SDtBQUM1SDtJQUNJLGtEQUFrRDtJQUNsRCxJQUFJLGVBQWUsR0FBRztRQUNsQixVQUFVLEVBQUUsMkJBQTJCO1FBQ3ZDLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUM7SUFDRixlQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQVBELHdCQU9DO0FBRUQ7SUFDSSxXQUFXO0lBQ1gsSUFBSSxlQUFlLEdBQUc7UUFDbEIsVUFBVSxFQUFFLGlCQUFpQjtRQUM3QixZQUFZLEVBQUUsSUFBSTtLQUNyQixDQUFDO0lBQ0YsZUFBTyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFQRCxvQkFPQztBQUVEO0lBQ0ksVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFGRCxzQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRXZlbnREYXRhLCBmcm9tT2JqZWN0LCBQcm9wZXJ0eUNoYW5nZURhdGEgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS9saXN0dmlld1wiO1xuaW1wb3J0IHsgaGFzS2V5LCBzZXRCb29sZWFuIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyB0b3Btb3N0LCBnb0JhY2sgfSBmcm9tIFwidWkvZnJhbWVcIjtcbmltcG9ydCB7IENvbmZpZywgU2Nob29sIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgeyBTY2hvb2xMaXN0IH0gZnJvbSAnLi4vLi4vdmlldy1tb2RlbHMvc2Nob29scy12bSc7XG5pbXBvcnQgKiBhcyBmaXJlYmFzZSBmcm9tIFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiO1xuXG52YXIgbGlzdFZpZXc7XG52YXIgc2Nob29sTGlzdCA9IG5ldyBTY2hvb2xMaXN0O1xudmFyIHBhZ2VEYXRhOiBPYnNlcnZhYmxlID0gZnJvbU9iamVjdCh7XG4gICAgc2Nob29sczogc2Nob29sTGlzdCxcbiAgICBmaXJzdFRpbWVVc2U6IHRydWUsXG4gICAgc2hvd05leHRCdXR0b246IGZhbHNlLFxuICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICBzY2hvb2xFcnJvcjogXCJcIixcbiAgICBhdXRoOiBcIlwiXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkgeyAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHBhZ2VcbiAgICBsZXQgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xuICAgIGxpc3RWaWV3ID0gPFJhZExpc3RWaWV3PnBhZ2UuZ2V0Vmlld0J5SWQoXCJsaXN0Vmlld1wiKTtcblxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQ9cGFnZURhdGE7XG5cbiAgICBmaXJlYmFzZS5nZXRDdXJyZW50UHVzaFRva2VuKCkudGhlbih0b2tlbiA9PiB7XG4gICAgICAgIHBhZ2VEYXRhLnNldChcImF1dGhcIiwgdG9rZW4pO1xuICAgIH0pO1xuICAgIFxuXG4gICAgLy8gRG91YmxlIGRvd24gb24gaGlkaW5nIHRoZSBidXR0b24gYmVmb3JlIGNoZWNraW5nIGFzIGl0IHNvbWV0aW1lcyBmbGFzaGVzIG9uXG4gICAgcGFnZURhdGEuc2V0KFwic2hvd05leHRCdXR0b25cIiwgZmFsc2UpO1xuXG4gICAgbGV0IG5hdkNvbnRleHQgPSBwYWdlLm5hdmlnYXRpb25Db250ZXh0O1xuICAgIGlmICggbmF2Q29udGV4dCApIHtcbiAgICAgICAgcGFnZURhdGEuc2V0KFwiZmlyc3RUaW1lVXNlXCIsICFuYXZDb250ZXh0LnNldHRpbmdzKTtcbiAgICB9XG4gICAgICAgXG4gICAgLy8gTG9hZCBzY2hvb2xzXG4gICAgLy9zY2hvb2xMaXN0LmNsZWFyKCk7IC8vQ3Jhc2hlcyBpbiBpT1NcbiAgICBzY2hvb2xMaXN0LmxvYWQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxlY3RTY2hvb2xzKCk7XG4gICAgICAgIHBhZ2VEYXRhLnNldChcImlzTG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIHBhZ2VEYXRhLnNldChcInNjaG9vbEVycm9yXCIsIFwiXCIpO1xuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKHBhZ2VEYXRhLmdldChcInNjaG9vbHNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VsZWN0U2Nob29scygpO1xuICAgICAgICAgICAgcGFnZURhdGEuc2V0KFwic2Nob29sRXJyb3JcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3RyRXJyb3I6IHN0cmluZztcbiAgICAgICAgICAgIGlmIChlcnJvci50b1N0cmluZygpLmluY2x1ZGVzKFwib2ZmbGluZVwiKSkge1xuICAgICAgICAgICAgICAgIHN0ckVycm9yID0gXCJZb3UgZG8gbm90IGFwcGVhciB0byBoYXZlIGFuIEludGVybmV0IENvbm5lY3Rpb24sIHBsZWFzZSB0cnkgYWdhaW4gd2hlbiB5b3UgYXJlIGNvbm5lY3RlZC5cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIlRoZXJlIGFwcGVhcnMgdG8gYmUgYW4gZXJyb3Igd2l0aCBvdXIgc2VydmVyLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFnZURhdGEuc2V0KFwic2Nob29sRXJyb3JcIiwgc3RyRXJyb3IpO1xuICAgICAgICB9ICAgICBcbiAgICAgICAgcGFnZURhdGEuc2V0KFwiaXNMb2FkaW5nXCIsIGZhbHNlKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0U2Nob29scygpIHtcbiAgICAvLyAnU2VsZWN0JyBzYXZlZCBzY2hvb2xzXG4gICAgcGFnZURhdGEuZ2V0KFwic2Nob29sc1wiKS5mb3JFYWNoKChzY2hvb2w6IFNjaG9vbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBpZiAoc2Nob29sLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBsaXN0Vmlldy5zZWxlY3RJdGVtQXQoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSlcbn1cblxuLy8gU2F2ZSBzZWxlY3RlZCBzY2hvb2xzXG5leHBvcnQgZnVuY3Rpb24gb25JdGVtU2VsZWN0ZWQoYXJncykge1xuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBzdG9yZSBhbGwgc2VsZWN0ZWQgc2Nob29sc1xuICAgIGxldCBhcnJTY2hvb2xzOiBudW1iZXJbXSA9IFtdO1xuICAgIFxuICAgIC8vIElmIHRoZSBhcHAgaXMgc3RhcnRlZCB3aXRoIG5vIGludGVybmV0IGFuZCB0aGVuIHJlZnJlc2hlZCB0aHJvdWdoIHRoZSBidXR0b24sIGl0IGNyYXNoZXMuIFRoaXMgZml4ZXMgdGhlIGNyYXNoLi4uXG4gICAgaWYgKCFsaXN0Vmlldykge1xuICAgICAgICBsaXN0VmlldyA9IGxpc3RWaWV3ID0gPFJhZExpc3RWaWV3PnRvcG1vc3QoKS5nZXRWaWV3QnlJZChcImxpc3RWaWV3XCIpO1xuICAgIH1cbiAgICBcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIG9mIHRoZSBzZWxlY3RlZCBpdGVtcyBpbiB0aGUgUmFkTGlzdFZpZXdcbiAgICBsaXN0Vmlldy5nZXRTZWxlY3RlZEl0ZW1zKCkuZm9yRWFjaCgoc2Nob29sOiBTY2hvb2wpID0+IHtcbiAgICAgICAgLy8gUHVzaCBpbnRvIHRoZSBhcnJheVxuICAgICAgICBhcnJTY2hvb2xzLnB1c2goTnVtYmVyKHNjaG9vbC5pZCkpO1xuXG4gICAgICAgIC8vIEFkZCBhIGZsYWcgdG8gdXBkYXRlIGFueSBub3RpZmljYXRpb24gdG9waWMgc3Vic2NyaXB0aW9uc1xuICAgICAgICBzZXRCb29sZWFuKFwidXBkYXRlTm90aWZpY2F0aW9uVG9waWNzXCIsIHRydWUpXG4gICAgfSk7XG5cbiAgICAvLyBTZW5kIHRoZSBlbnRpcmUgYXJyYXkgb2Ygc2VsZWN0ZWQgc2Nob29scyB0byB0aGUgdmlldy1tb2RlbFxuICAgIHNjaG9vbExpc3QubXlTY2hvb2xzID0gYXJyU2Nob29scztcbiAgICBcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gc2F2ZWQgc2Nob29scywgdGhlIGFwcCBpcyBydW5uaW5nIGZvciB0aGUgZmlyc3QgdGltZSAtIHNob3cgYSBuZXh0IGJ1dHRvbiBvbmNlIHRoZXkgaGF2ZSBzZWxlY3RlZCBhdCBsZWFzdCBvbmUgc2Nob29sXG4gICAgcGFnZURhdGEuc2V0KFwic2hvd05leHRCdXR0b25cIiwgKHBhZ2VEYXRhLmdldChcImZpcnN0VGltZVVzZVwiKSAmJiBhcnJTY2hvb2xzLmxlbmd0aCA+IDApKTtcbn1cblxuLy8gSWYgdGhlIGFwcCBpcyBydW5uaW5nIGZvciB0aGUgZmlyc3QgdGltZSwgZ28gdG8gdGhlIG5leHQgcGFnZSAod2hlbiBhY2Nlc3NlZCB2aWEgc2V0dGluZ3MsIGEgYmFjayBidXR0b24gd2lsbCBiZSBwcmVzZW50KVxuZXhwb3J0IGZ1bmN0aW9uIGdvTmV4dCgpIHtcbiAgICAvL3RvcG1vc3QoKS5uYXZpZ2F0ZShcInZpZXdzL2FsbGVyZ2Vucy9hbGxlcmdlbnNcIik7XG4gICAgdmFyIG5hdmlnYXRpb25FbnRyeSA9IHtcbiAgICAgICAgbW9kdWxlTmFtZTogXCJ2aWV3cy9hbGxlcmdlbnMvYWxsZXJnZW5zXCIsXG4gICAgICAgIGNsZWFySGlzdG9yeTogdHJ1ZVxuICAgIH07XG4gICAgdG9wbW9zdCgpLm5hdmlnYXRlKG5hdmlnYXRpb25FbnRyeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYWNrKCkge1xuICAgIC8vZ29CYWNrKCk7XG4gICAgdmFyIG5hdmlnYXRpb25FbnRyeSA9IHtcbiAgICAgICAgbW9kdWxlTmFtZTogXCJ2aWV3cy9tYWluL21haW5cIixcbiAgICAgICAgY2xlYXJIaXN0b3J5OiB0cnVlXG4gICAgfTtcbiAgICB0b3Btb3N0KCkubmF2aWdhdGUobmF2aWdhdGlvbkVudHJ5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlZEZyb20oKSB7XG4gICAgc2Nob29sTGlzdC5jbGVhcigpO1xufSJdfQ==