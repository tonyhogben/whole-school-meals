"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var frame_1 = require("ui/frame");
var schools_vm_1 = require("../../view-models/schools-vm");
var nativescript_plugin_firebase_1 = require("nativescript-plugin-firebase");
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
        // Subscribe to the 'topic' for notifications
        nativescript_plugin_firebase_1.subscribeToTopic(school.name);
    });
    // Send the entire array of selected schools to the view-model
    schoolList.mySchools = arrSchools;
    // If there are no saved schools, the app is running for the first time - show a next button once they have selected at least one school
    pageData.set("showNextButton", (pageData.get("firstTimeUse") && arrSchools.length > 0));
}
exports.onItemSelected = onItemSelected;
// If the app is running for the first time, go to the next page (when accessed via settings, a back button will be present)
function goNext() {
    frame_1.topmost().navigate("views/allergens/allergens");
}
exports.goNext = goNext;
function back() {
    frame_1.goBack();
}
exports.back = back;
function navigatedFrom() {
    schoolList.clear();
}
exports.navigatedFrom = navigatedFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nob29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjaG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBd0Y7QUFHeEYsa0NBQTJDO0FBRTNDLDJEQUEwRDtBQUMxRCw2RUFBZ0U7QUFFaEUsSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUM7QUFDaEMsSUFBSSxRQUFRLEdBQWUsdUJBQVUsQ0FBQztJQUNsQyxPQUFPLEVBQUUsVUFBVTtJQUNuQixZQUFZLEVBQUUsSUFBSTtJQUNsQixjQUFjLEVBQUUsS0FBSztJQUNyQixTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRSxFQUFFO0NBQ2xCLENBQUMsQ0FBQztBQUVILGtCQUF5QixJQUFlO0lBQ3BDLGtCQUFrQjtJQUNsQixJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLFFBQVEsR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxJQUFJLENBQUMsY0FBYyxHQUFDLFFBQVEsQ0FBQztJQUU3Qiw4RUFBOEU7SUFDOUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV0QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUUsVUFBVyxDQUFDLENBQUMsQ0FBQztRQUNmLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxlQUFlO0lBQ2Ysc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbkIsYUFBYSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztRQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsYUFBYSxFQUFFLENBQUM7WUFDaEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxRQUFRLFNBQVEsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxHQUFHLDRGQUE0RixDQUFDO1lBQzVHLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFRLEdBQUcsdUVBQXVFLENBQUM7WUFDdkYsQ0FBQztZQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFwQ0QsNEJBb0NDO0FBRUQ7SUFDSSx5QkFBeUI7SUFDekIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjLEVBQUUsS0FBYTtRQUMxRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQixRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCx3QkFBd0I7QUFDeEIsd0JBQStCLElBQUk7SUFDL0IsZ0RBQWdEO0lBQ2hELElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUU5QixvSEFBb0g7SUFDcEgsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ1osUUFBUSxHQUFHLFFBQVEsR0FBZ0IsZUFBTyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCw0REFBNEQ7SUFDNUQsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBYztRQUMvQyxzQkFBc0I7UUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkMsNkNBQTZDO1FBQzdDLCtDQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILDhEQUE4RDtJQUM5RCxVQUFVLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUVsQyx3SUFBd0k7SUFDeEksUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVGLENBQUM7QUF2QkQsd0NBdUJDO0FBRUQsNEhBQTRIO0FBQzVIO0lBQ0ksZUFBTyxFQUFFLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUZELHdCQUVDO0FBRUQ7SUFDSSxjQUFNLEVBQUUsQ0FBQztBQUNiLENBQUM7QUFGRCxvQkFFQztBQUVEO0lBQ0ksVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFGRCxzQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRXZlbnREYXRhLCBmcm9tT2JqZWN0LCBQcm9wZXJ0eUNoYW5nZURhdGEgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBSYWRMaXN0VmlldyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS9saXN0dmlld1wiO1xuaW1wb3J0IHsgaGFzS2V5IH0gZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyB0b3Btb3N0LCBnb0JhY2sgfSBmcm9tIFwidWkvZnJhbWVcIjtcbmltcG9ydCB7IENvbmZpZywgU2Nob29sIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgeyBTY2hvb2xMaXN0IH0gZnJvbSAnLi4vLi4vdmlldy1tb2RlbHMvc2Nob29scy12bSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1RvcGljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2VcIjtcblxudmFyIGxpc3RWaWV3O1xudmFyIHNjaG9vbExpc3QgPSBuZXcgU2Nob29sTGlzdDtcbnZhciBwYWdlRGF0YTogT2JzZXJ2YWJsZSA9IGZyb21PYmplY3Qoe1xuICAgIHNjaG9vbHM6IHNjaG9vbExpc3QsXG4gICAgZmlyc3RUaW1lVXNlOiB0cnVlLFxuICAgIHNob3dOZXh0QnV0dG9uOiBmYWxzZSxcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgc2Nob29sRXJyb3I6IFwiXCJcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkZWQoYXJnczogRXZlbnREYXRhKSB7ICAgIFxuICAgIC8vIFNldCB1cCB0aGUgcGFnZVxuICAgIGxldCBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XG4gICAgbGlzdFZpZXcgPSA8UmFkTGlzdFZpZXc+cGFnZS5nZXRWaWV3QnlJZChcImxpc3RWaWV3XCIpO1xuXG4gICAgcGFnZS5iaW5kaW5nQ29udGV4dD1wYWdlRGF0YTtcblxuICAgIC8vIERvdWJsZSBkb3duIG9uIGhpZGluZyB0aGUgYnV0dG9uIGJlZm9yZSBjaGVja2luZyBhcyBpdCBzb21ldGltZXMgZmxhc2hlcyBvblxuICAgIHBhZ2VEYXRhLnNldChcInNob3dOZXh0QnV0dG9uXCIsIGZhbHNlKTtcblxuICAgIGxldCBuYXZDb250ZXh0ID0gcGFnZS5uYXZpZ2F0aW9uQ29udGV4dDtcbiAgICBpZiAoIG5hdkNvbnRleHQgKSB7XG4gICAgICAgIHBhZ2VEYXRhLnNldChcImZpcnN0VGltZVVzZVwiLCAhbmF2Q29udGV4dC5zZXR0aW5ncyk7XG4gICAgfVxuICAgICAgIFxuICAgIC8vIExvYWQgc2Nob29sc1xuICAgIC8vc2Nob29sTGlzdC5jbGVhcigpOyAvL0NyYXNoZXMgaW4gaU9TXG4gICAgc2Nob29sTGlzdC5sb2FkKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZWN0U2Nob29scygpO1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJzY2hvb2xFcnJvclwiLCBcIlwiKTtcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGlmIChwYWdlRGF0YS5nZXQoXCJzY2hvb2xzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbGVjdFNjaG9vbHMoKTtcbiAgICAgICAgICAgIHBhZ2VEYXRhLnNldChcInNjaG9vbEVycm9yXCIsIFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHN0ckVycm9yOiBzdHJpbmc7XG4gICAgICAgICAgICBpZiAoZXJyb3IudG9TdHJpbmcoKS5pbmNsdWRlcyhcIm9mZmxpbmVcIikpIHtcbiAgICAgICAgICAgICAgICBzdHJFcnJvciA9IFwiWW91IGRvIG5vdCBhcHBlYXIgdG8gaGF2ZSBhbiBJbnRlcm5ldCBDb25uZWN0aW9uLCBwbGVhc2UgdHJ5IGFnYWluIHdoZW4geW91IGFyZSBjb25uZWN0ZWQuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0ckVycm9yID0gXCJUaGVyZSBhcHBlYXJzIHRvIGJlIGFuIGVycm9yIHdpdGggb3VyIHNlcnZlciwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhZ2VEYXRhLnNldChcInNjaG9vbEVycm9yXCIsIHN0ckVycm9yKTtcbiAgICAgICAgfSAgICAgXG4gICAgICAgIHBhZ2VEYXRhLnNldChcImlzTG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdFNjaG9vbHMoKSB7XG4gICAgLy8gJ1NlbGVjdCcgc2F2ZWQgc2Nob29sc1xuICAgIHBhZ2VEYXRhLmdldChcInNjaG9vbHNcIikuZm9yRWFjaCgoc2Nob29sOiBTY2hvb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKHNjaG9vbC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgbGlzdFZpZXcuc2VsZWN0SXRlbUF0KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8vIFNhdmUgc2VsZWN0ZWQgc2Nob29sc1xuZXhwb3J0IGZ1bmN0aW9uIG9uSXRlbVNlbGVjdGVkKGFyZ3MpIHtcbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gc3RvcmUgYWxsIHNlbGVjdGVkIHNjaG9vbHNcbiAgICBsZXQgYXJyU2Nob29sczogbnVtYmVyW10gPSBbXTtcbiAgICBcbiAgICAvLyBJZiB0aGUgYXBwIGlzIHN0YXJ0ZWQgd2l0aCBubyBpbnRlcm5ldCBhbmQgdGhlbiByZWZyZXNoZWQgdGhyb3VnaCB0aGUgYnV0dG9uLCBpdCBjcmFzaGVzLiBUaGlzIGZpeGVzIHRoZSBjcmFzaC4uLlxuICAgIGlmICghbGlzdFZpZXcpIHtcbiAgICAgICAgbGlzdFZpZXcgPSBsaXN0VmlldyA9IDxSYWRMaXN0Vmlldz50b3Btb3N0KCkuZ2V0Vmlld0J5SWQoXCJsaXN0Vmlld1wiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCBvZiB0aGUgc2VsZWN0ZWQgaXRlbXMgaW4gdGhlIFJhZExpc3RWaWV3XG4gICAgbGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtcygpLmZvckVhY2goKHNjaG9vbDogU2Nob29sKSA9PiB7XG4gICAgICAgIC8vIFB1c2ggaW50byB0aGUgYXJyYXlcbiAgICAgICAgYXJyU2Nob29scy5wdXNoKE51bWJlcihzY2hvb2wuaWQpKTtcblxuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gdGhlICd0b3BpYycgZm9yIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgc3Vic2NyaWJlVG9Ub3BpYyhzY2hvb2wubmFtZSlcbiAgICB9KTtcblxuICAgIC8vIFNlbmQgdGhlIGVudGlyZSBhcnJheSBvZiBzZWxlY3RlZCBzY2hvb2xzIHRvIHRoZSB2aWV3LW1vZGVsXG4gICAgc2Nob29sTGlzdC5teVNjaG9vbHMgPSBhcnJTY2hvb2xzO1xuICAgIFxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBzYXZlZCBzY2hvb2xzLCB0aGUgYXBwIGlzIHJ1bm5pbmcgZm9yIHRoZSBmaXJzdCB0aW1lIC0gc2hvdyBhIG5leHQgYnV0dG9uIG9uY2UgdGhleSBoYXZlIHNlbGVjdGVkIGF0IGxlYXN0IG9uZSBzY2hvb2xcbiAgICBwYWdlRGF0YS5zZXQoXCJzaG93TmV4dEJ1dHRvblwiLCAocGFnZURhdGEuZ2V0KFwiZmlyc3RUaW1lVXNlXCIpICYmIGFyclNjaG9vbHMubGVuZ3RoID4gMCkpO1xufVxuXG4vLyBJZiB0aGUgYXBwIGlzIHJ1bm5pbmcgZm9yIHRoZSBmaXJzdCB0aW1lLCBnbyB0byB0aGUgbmV4dCBwYWdlICh3aGVuIGFjY2Vzc2VkIHZpYSBzZXR0aW5ncywgYSBiYWNrIGJ1dHRvbiB3aWxsIGJlIHByZXNlbnQpXG5leHBvcnQgZnVuY3Rpb24gZ29OZXh0KCkge1xuICAgIHRvcG1vc3QoKS5uYXZpZ2F0ZShcInZpZXdzL2FsbGVyZ2Vucy9hbGxlcmdlbnNcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYWNrKCkge1xuICAgIGdvQmFjaygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGVkRnJvbSgpIHtcbiAgICBzY2hvb2xMaXN0LmNsZWFyKCk7XG59Il19