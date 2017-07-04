"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var application_settings_1 = require("application-settings");
var frame_1 = require("ui/frame");
var schools_vm_1 = require("../../view-models/schools-vm");
var listView;
var schoolList = new schools_vm_1.SchoolList;
var pageData = observable_1.fromObject({
    schools: schoolList,
    firstTimeUse: true,
    showNextButton: false,
    isLoading: true,
    schoolError: ""
});
function onLoaded(args) {
    // Set up the page
    var page = args.object;
    listView = page.getViewById("listView");
    page.bindingContext = pageData;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBd0Y7QUFFeEYsNkRBQTBEO0FBQzFELGtDQUEyQztBQUUzQywyREFBMEQ7QUFFMUQsSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUM7QUFDaEMsSUFBSSxRQUFRLEdBQWUsdUJBQVUsQ0FBQztJQUNsQyxPQUFPLEVBQUUsVUFBVTtJQUNuQixZQUFZLEVBQUUsSUFBSTtJQUNsQixjQUFjLEVBQUUsS0FBSztJQUNyQixTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRSxFQUFFO0NBQ2xCLENBQUMsQ0FBQztBQUVILGtCQUF5QixJQUFlO0lBQ3BDLGtCQUFrQjtJQUNsQixJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLFFBQVEsR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxJQUFJLENBQUMsY0FBYyxHQUFDLFFBQVEsQ0FBQztJQUU3Qiw4RUFBOEU7SUFDOUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV0QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUUsVUFBVyxDQUFDLENBQUMsQ0FBQztRQUNmLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxlQUFlO0lBQ2Ysc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbkIsYUFBYSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLEdBQUcs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QkFPQztBQUVEO0lBQ0ksVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFGRCxzQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRXZlbnREYXRhLCBmcm9tT2JqZWN0LCBQcm9wZXJ0eUNoYW5nZURhdGEgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS9saXN0dmlld1wiO1xuaW1wb3J0IHsgaGFzS2V5LCBzZXRCb29sZWFuIH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyB0b3Btb3N0LCBnb0JhY2sgfSBmcm9tIFwidWkvZnJhbWVcIjtcbmltcG9ydCB7IENvbmZpZywgU2Nob29sIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgeyBTY2hvb2xMaXN0IH0gZnJvbSAnLi4vLi4vdmlldy1tb2RlbHMvc2Nob29scy12bSc7XG5cbnZhciBsaXN0VmlldztcbnZhciBzY2hvb2xMaXN0ID0gbmV3IFNjaG9vbExpc3Q7XG52YXIgcGFnZURhdGE6IE9ic2VydmFibGUgPSBmcm9tT2JqZWN0KHtcbiAgICBzY2hvb2xzOiBzY2hvb2xMaXN0LFxuICAgIGZpcnN0VGltZVVzZTogdHJ1ZSxcbiAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsXG4gICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgIHNjaG9vbEVycm9yOiBcIlwiXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkgeyAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHBhZ2VcbiAgICBsZXQgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xuICAgIGxpc3RWaWV3ID0gPFJhZExpc3RWaWV3PnBhZ2UuZ2V0Vmlld0J5SWQoXCJsaXN0Vmlld1wiKTtcblxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQ9cGFnZURhdGE7XG5cbiAgICAvLyBEb3VibGUgZG93biBvbiBoaWRpbmcgdGhlIGJ1dHRvbiBiZWZvcmUgY2hlY2tpbmcgYXMgaXQgc29tZXRpbWVzIGZsYXNoZXMgb25cbiAgICBwYWdlRGF0YS5zZXQoXCJzaG93TmV4dEJ1dHRvblwiLCBmYWxzZSk7XG5cbiAgICBsZXQgbmF2Q29udGV4dCA9IHBhZ2UubmF2aWdhdGlvbkNvbnRleHQ7XG4gICAgaWYgKCBuYXZDb250ZXh0ICkge1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJmaXJzdFRpbWVVc2VcIiwgIW5hdkNvbnRleHQuc2V0dGluZ3MpO1xuICAgIH1cbiAgICAgICBcbiAgICAvLyBMb2FkIHNjaG9vbHNcbiAgICAvL3NjaG9vbExpc3QuY2xlYXIoKTsgLy9DcmFzaGVzIGluIGlPU1xuICAgIHNjaG9vbExpc3QubG9hZCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGVjdFNjaG9vbHMoKTtcbiAgICAgICAgcGFnZURhdGEuc2V0KFwiaXNMb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgcGFnZURhdGEuc2V0KFwic2Nob29sRXJyb3JcIiwgXCJcIik7XG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBpZiAocGFnZURhdGEuZ2V0KFwic2Nob29sc1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxlY3RTY2hvb2xzKCk7XG4gICAgICAgICAgICBwYWdlRGF0YS5zZXQoXCJzY2hvb2xFcnJvclwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzdHJFcnJvcjogc3RyaW5nO1xuICAgICAgICAgICAgaWYgKGVycm9yLnRvU3RyaW5nKCkuaW5jbHVkZXMoXCJvZmZsaW5lXCIpKSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIllvdSBkbyBub3QgYXBwZWFyIHRvIGhhdmUgYW4gSW50ZXJuZXQgQ29ubmVjdGlvbiwgcGxlYXNlIHRyeSBhZ2FpbiB3aGVuIHlvdSBhcmUgY29ubmVjdGVkLlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJFcnJvciA9IFwiVGhlcmUgYXBwZWFycyB0byBiZSBhbiBlcnJvciB3aXRoIG91ciBzZXJ2ZXIsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYWdlRGF0YS5zZXQoXCJzY2hvb2xFcnJvclwiLCBzdHJFcnJvcik7XG4gICAgICAgIH0gICAgIFxuICAgICAgICBwYWdlRGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RTY2hvb2xzKCkge1xuICAgIC8vICdTZWxlY3QnIHNhdmVkIHNjaG9vbHNcbiAgICBwYWdlRGF0YS5nZXQoXCJzY2hvb2xzXCIpLmZvckVhY2goKHNjaG9vbDogU2Nob29sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGlmIChzY2hvb2wuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGxpc3RWaWV3LnNlbGVjdEl0ZW1BdChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vLyBTYXZlIHNlbGVjdGVkIHNjaG9vbHNcbmV4cG9ydCBmdW5jdGlvbiBvbkl0ZW1TZWxlY3RlZChhcmdzKSB7XG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIHN0b3JlIGFsbCBzZWxlY3RlZCBzY2hvb2xzXG4gICAgbGV0IGFyclNjaG9vbHM6IG51bWJlcltdID0gW107XG4gICAgXG4gICAgLy8gSWYgdGhlIGFwcCBpcyBzdGFydGVkIHdpdGggbm8gaW50ZXJuZXQgYW5kIHRoZW4gcmVmcmVzaGVkIHRocm91Z2ggdGhlIGJ1dHRvbiwgaXQgY3Jhc2hlcy4gVGhpcyBmaXhlcyB0aGUgY3Jhc2guLi5cbiAgICBpZiAoIWxpc3RWaWV3KSB7XG4gICAgICAgIGxpc3RWaWV3ID0gbGlzdFZpZXcgPSA8UmFkTGlzdFZpZXc+dG9wbW9zdCgpLmdldFZpZXdCeUlkKFwibGlzdFZpZXdcIik7XG4gICAgfVxuICAgIFxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgb2YgdGhlIHNlbGVjdGVkIGl0ZW1zIGluIHRoZSBSYWRMaXN0Vmlld1xuICAgIGxpc3RWaWV3LmdldFNlbGVjdGVkSXRlbXMoKS5mb3JFYWNoKChzY2hvb2w6IFNjaG9vbCkgPT4ge1xuICAgICAgICAvLyBQdXNoIGludG8gdGhlIGFycmF5XG4gICAgICAgIGFyclNjaG9vbHMucHVzaChOdW1iZXIoc2Nob29sLmlkKSk7XG5cbiAgICAgICAgLy8gQWRkIGEgZmxhZyB0byB1cGRhdGUgYW55IG5vdGlmaWNhdGlvbiB0b3BpYyBzdWJzY3JpcHRpb25zXG4gICAgICAgIHNldEJvb2xlYW4oXCJ1cGRhdGVOb3RpZmljYXRpb25Ub3BpY3NcIiwgdHJ1ZSlcbiAgICB9KTtcblxuICAgIC8vIFNlbmQgdGhlIGVudGlyZSBhcnJheSBvZiBzZWxlY3RlZCBzY2hvb2xzIHRvIHRoZSB2aWV3LW1vZGVsXG4gICAgc2Nob29sTGlzdC5teVNjaG9vbHMgPSBhcnJTY2hvb2xzO1xuICAgIFxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBzYXZlZCBzY2hvb2xzLCB0aGUgYXBwIGlzIHJ1bm5pbmcgZm9yIHRoZSBmaXJzdCB0aW1lIC0gc2hvdyBhIG5leHQgYnV0dG9uIG9uY2UgdGhleSBoYXZlIHNlbGVjdGVkIGF0IGxlYXN0IG9uZSBzY2hvb2xcbiAgICBwYWdlRGF0YS5zZXQoXCJzaG93TmV4dEJ1dHRvblwiLCAocGFnZURhdGEuZ2V0KFwiZmlyc3RUaW1lVXNlXCIpICYmIGFyclNjaG9vbHMubGVuZ3RoID4gMCkpO1xufVxuXG4vLyBJZiB0aGUgYXBwIGlzIHJ1bm5pbmcgZm9yIHRoZSBmaXJzdCB0aW1lLCBnbyB0byB0aGUgbmV4dCBwYWdlICh3aGVuIGFjY2Vzc2VkIHZpYSBzZXR0aW5ncywgYSBiYWNrIGJ1dHRvbiB3aWxsIGJlIHByZXNlbnQpXG5leHBvcnQgZnVuY3Rpb24gZ29OZXh0KCkge1xuICAgIC8vdG9wbW9zdCgpLm5hdmlnYXRlKFwidmlld3MvYWxsZXJnZW5zL2FsbGVyZ2Vuc1wiKTtcbiAgICB2YXIgbmF2aWdhdGlvbkVudHJ5ID0ge1xuICAgICAgICBtb2R1bGVOYW1lOiBcInZpZXdzL2FsbGVyZ2Vucy9hbGxlcmdlbnNcIixcbiAgICAgICAgY2xlYXJIaXN0b3J5OiB0cnVlXG4gICAgfTtcbiAgICB0b3Btb3N0KCkubmF2aWdhdGUobmF2aWdhdGlvbkVudHJ5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgLy9nb0JhY2soKTtcbiAgICB2YXIgbmF2aWdhdGlvbkVudHJ5ID0ge1xuICAgICAgICBtb2R1bGVOYW1lOiBcInZpZXdzL21haW4vbWFpblwiLFxuICAgICAgICBjbGVhckhpc3Rvcnk6IHRydWVcbiAgICB9O1xuICAgIHRvcG1vc3QoKS5uYXZpZ2F0ZShuYXZpZ2F0aW9uRW50cnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGVkRnJvbSgpIHtcbiAgICBzY2hvb2xMaXN0LmNsZWFyKCk7XG59Il19