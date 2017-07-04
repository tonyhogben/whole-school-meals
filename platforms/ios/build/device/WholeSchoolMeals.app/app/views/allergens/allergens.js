"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var frame_1 = require("ui/frame");
var allergens_vm_1 = require("../../view-models/allergens-vm");
var listView;
var allergenList = new allergens_vm_1.AllergenList;
var pageData = observable_1.fromObject({
    allergens: allergenList,
    showNextButton: true,
    isLoading: true,
    allergenError: ""
});
function onNavigatingTo(args) {
    var page = args.object;
    var gotData = page.navigationContext;
    console.log(gotData.firstTimeUse);
    onLoaded(args);
}
exports.onNavigatingTo = onNavigatingTo;
function onLoaded(args) {
    // Set up the page
    var page = args.object;
    listView = page.getViewById("listView");
    page.bindingContext = pageData;
    var navContext = page.navigationContext;
    if (navContext) {
        pageData.set("showNextButton", !navContext.settings);
    }
    // Load allergens
    //allergenList.clear(); //Crashes in iOS
    allergenList.load().then(function () {
        selectAllergens();
        pageData.set("isLoading", false);
        pageData.set("allergenError", "");
    }).catch(function (error) {
        if (pageData.get("allergens").length > 0) {
            selectAllergens();
            pageData.set("allergenError", "");
        }
        else {
            var strError = void 0;
            if (error.toString().includes("offline")) {
                strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
            }
            else {
                strError = "There appears to be an error with our server, please try again later.";
            }
            pageData.set("allergenError", strError);
        }
        pageData.set("isLoading", false);
    });
}
exports.onLoaded = onLoaded;
function selectAllergens() {
    // 'Select' saved allergens
    pageData.get("allergens").forEach(function (allergen, index) {
        if (allergen.selected) {
            listView.selectItemAt(index);
        }
    });
}
// Save selected allergens
function onItemSelected(args) {
    var arrAllergens = [];
    listView.getSelectedItems().forEach(function (allergen) {
        arrAllergens.push(Number(allergen.id));
    });
    allergenList.myAllergens = arrAllergens;
}
exports.onItemSelected = onItemSelected;
// If the app is running for the first time, go to the next page (when accessed via settings, a back button will be present)
function goNext() {
    var navigationEntry = {
        moduleName: "views/main/main",
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
    allergenList.clear();
}
exports.navigatedFrom = navigatedFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsZXJnZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWxsZXJnZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOENBQXdGO0FBR3hGLGtDQUEyQztBQUUzQywrREFBOEQ7QUFFOUQsSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLFlBQVksR0FBRyxJQUFJLDJCQUFZLENBQUM7QUFDcEMsSUFBSSxRQUFRLEdBQWUsdUJBQVUsQ0FBQztJQUNsQyxTQUFTLEVBQUUsWUFBWTtJQUN2QixjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxFQUFFO0NBQ3BCLENBQUMsQ0FBQztBQUVILHdCQUErQixJQUFlO0lBQzFDLElBQUksSUFBSSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBTEQsd0NBS0M7QUFFRCxrQkFBeUIsSUFBZTtJQUNwQyxrQkFBa0I7SUFDbEIsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixRQUFRLEdBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFckQsSUFBSSxDQUFDLGNBQWMsR0FBQyxRQUFRLENBQUM7SUFFN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxDQUFFLFVBQVcsQ0FBQyxDQUFDLENBQUM7UUFDZixRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxpQkFBaUI7SUFDakIsd0NBQXdDO0lBQ3hDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDckIsZUFBZSxFQUFFLENBQUM7UUFDbEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztRQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsZUFBZSxFQUFFLENBQUM7WUFDbEIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxRQUFRLFNBQVEsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxHQUFHLDRGQUE0RixDQUFDO1lBQzVHLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFRLEdBQUcsdUVBQXVFLENBQUM7WUFDdkYsQ0FBQztZQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDRCxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFqQ0QsNEJBaUNDO0FBRUQ7SUFDSSwyQkFBMkI7SUFDM0IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFrQixFQUFFLEtBQWE7UUFDaEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEIsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsMEJBQTBCO0FBQzFCLHdCQUErQixJQUFJO0lBQy9CLElBQUksWUFBWSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFrQjtRQUNuRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILFlBQVksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBQzVDLENBQUM7QUFQRCx3Q0FPQztBQUVELDRIQUE0SDtBQUM1SDtJQUNJLElBQUksZUFBZSxHQUFHO1FBQ2xCLFVBQVUsRUFBRSxpQkFBaUI7UUFDN0IsWUFBWSxFQUFFLElBQUk7S0FDckIsQ0FBQztJQUNGLGVBQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBTkQsd0JBTUM7QUFFRDtJQUNJLFdBQVc7SUFDWCxJQUFJLGVBQWUsR0FBRztRQUNsQixVQUFVLEVBQUUsaUJBQWlCO1FBQzdCLFlBQVksRUFBRSxJQUFJO0tBQ3JCLENBQUM7SUFDRixlQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQVBELG9CQU9DO0FBRUQ7SUFDSSxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekIsQ0FBQztBQUZELHNDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFdmVudERhdGEsIGZyb21PYmplY3QsIFByb3BlcnR5Q2hhbmdlRGF0YSB9IGZyb20gXCJkYXRhL29ic2VydmFibGVcIjtcbmltcG9ydCB7IFJhZExpc3RWaWV3IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpL2xpc3R2aWV3XCI7XG5pbXBvcnQgeyBoYXNLZXksIHJlbW92ZSwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCB7IHRvcG1vc3QsIGdvQmFjayB9IGZyb20gXCJ1aS9mcmFtZVwiO1xuaW1wb3J0IHsgQ29uZmlnLCBBbGxlcmdlbiB9IGZyb20gJy4uLy4uL3NoYXJlZC9tb2RlbHMnO1xuaW1wb3J0IHsgQWxsZXJnZW5MaXN0IH0gZnJvbSAnLi4vLi4vdmlldy1tb2RlbHMvYWxsZXJnZW5zLXZtJztcblxudmFyIGxpc3RWaWV3O1xudmFyIGFsbGVyZ2VuTGlzdCA9IG5ldyBBbGxlcmdlbkxpc3Q7XG52YXIgcGFnZURhdGE6IE9ic2VydmFibGUgPSBmcm9tT2JqZWN0KHtcbiAgICBhbGxlcmdlbnM6IGFsbGVyZ2VuTGlzdCxcbiAgICBzaG93TmV4dEJ1dHRvbjogdHJ1ZSxcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgYWxsZXJnZW5FcnJvcjogXCJcIlxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBvbk5hdmlnYXRpbmdUbyhhcmdzOiBFdmVudERhdGEpIHtcbiAgICBsZXQgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xuICAgIGxldCBnb3REYXRhID0gcGFnZS5uYXZpZ2F0aW9uQ29udGV4dDtcbiAgICBjb25zb2xlLmxvZyhnb3REYXRhLmZpcnN0VGltZVVzZSk7XG4gICAgb25Mb2FkZWQoYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWRlZChhcmdzOiBFdmVudERhdGEpIHsgICBcbiAgICAvLyBTZXQgdXAgdGhlIHBhZ2VcbiAgICBsZXQgcGFnZSA9IDxQYWdlPmFyZ3Mub2JqZWN0O1xuICAgIGxpc3RWaWV3ID0gPFJhZExpc3RWaWV3PnBhZ2UuZ2V0Vmlld0J5SWQoXCJsaXN0Vmlld1wiKTtcblxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQ9cGFnZURhdGE7XG5cbiAgICBsZXQgbmF2Q29udGV4dCA9IHBhZ2UubmF2aWdhdGlvbkNvbnRleHQ7XG4gICAgaWYgKCBuYXZDb250ZXh0ICkge1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJzaG93TmV4dEJ1dHRvblwiLCAhbmF2Q29udGV4dC5zZXR0aW5ncyk7XG4gICAgfVxuICAgICAgICBcbiAgICAvLyBMb2FkIGFsbGVyZ2Vuc1xuICAgIC8vYWxsZXJnZW5MaXN0LmNsZWFyKCk7IC8vQ3Jhc2hlcyBpbiBpT1NcbiAgICBhbGxlcmdlbkxpc3QubG9hZCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGVjdEFsbGVyZ2VucygpO1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBwYWdlRGF0YS5zZXQoXCJhbGxlcmdlbkVycm9yXCIsIFwiXCIpO1xuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgaWYgKHBhZ2VEYXRhLmdldChcImFsbGVyZ2Vuc1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxlY3RBbGxlcmdlbnMoKTtcbiAgICAgICAgICAgIHBhZ2VEYXRhLnNldChcImFsbGVyZ2VuRXJyb3JcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3RyRXJyb3I6IHN0cmluZztcbiAgICAgICAgICAgIGlmIChlcnJvci50b1N0cmluZygpLmluY2x1ZGVzKFwib2ZmbGluZVwiKSkge1xuICAgICAgICAgICAgICAgIHN0ckVycm9yID0gXCJZb3UgZG8gbm90IGFwcGVhciB0byBoYXZlIGFuIEludGVybmV0IENvbm5lY3Rpb24sIHBsZWFzZSB0cnkgYWdhaW4gd2hlbiB5b3UgYXJlIGNvbm5lY3RlZC5cIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIlRoZXJlIGFwcGVhcnMgdG8gYmUgYW4gZXJyb3Igd2l0aCBvdXIgc2VydmVyLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFnZURhdGEuc2V0KFwiYWxsZXJnZW5FcnJvclwiLCBzdHJFcnJvcik7XG4gICAgICAgIH0gICBcbiAgICAgICAgcGFnZURhdGEuc2V0KFwiaXNMb2FkaW5nXCIsIGZhbHNlKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0QWxsZXJnZW5zKCkge1xuICAgIC8vICdTZWxlY3QnIHNhdmVkIGFsbGVyZ2Vuc1xuICAgIHBhZ2VEYXRhLmdldChcImFsbGVyZ2Vuc1wiKS5mb3JFYWNoKChhbGxlcmdlbjogQWxsZXJnZW4sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKGFsbGVyZ2VuLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBsaXN0Vmlldy5zZWxlY3RJdGVtQXQoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIFNhdmUgc2VsZWN0ZWQgYWxsZXJnZW5zXG5leHBvcnQgZnVuY3Rpb24gb25JdGVtU2VsZWN0ZWQoYXJncykge1xuICAgIGxldCBhcnJBbGxlcmdlbnM6IG51bWJlcltdID0gW107XG4gICAgbGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtcygpLmZvckVhY2goKGFsbGVyZ2VuOiBBbGxlcmdlbikgPT4ge1xuICAgICAgICBhcnJBbGxlcmdlbnMucHVzaChOdW1iZXIoYWxsZXJnZW4uaWQpKTtcbiAgICB9KTtcblxuICAgIGFsbGVyZ2VuTGlzdC5teUFsbGVyZ2VucyA9IGFyckFsbGVyZ2Vucztcbn1cblxuLy8gSWYgdGhlIGFwcCBpcyBydW5uaW5nIGZvciB0aGUgZmlyc3QgdGltZSwgZ28gdG8gdGhlIG5leHQgcGFnZSAod2hlbiBhY2Nlc3NlZCB2aWEgc2V0dGluZ3MsIGEgYmFjayBidXR0b24gd2lsbCBiZSBwcmVzZW50KVxuZXhwb3J0IGZ1bmN0aW9uIGdvTmV4dCgpIHtcbiAgICB2YXIgbmF2aWdhdGlvbkVudHJ5ID0ge1xuICAgICAgICBtb2R1bGVOYW1lOiBcInZpZXdzL21haW4vbWFpblwiLFxuICAgICAgICBjbGVhckhpc3Rvcnk6IHRydWVcbiAgICB9O1xuICAgIHRvcG1vc3QoKS5uYXZpZ2F0ZShuYXZpZ2F0aW9uRW50cnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFjaygpIHtcbiAgICAvL2dvQmFjaygpO1xuICAgIHZhciBuYXZpZ2F0aW9uRW50cnkgPSB7XG4gICAgICAgIG1vZHVsZU5hbWU6IFwidmlld3MvbWFpbi9tYWluXCIsXG4gICAgICAgIGNsZWFySGlzdG9yeTogdHJ1ZVxuICAgIH07XG4gICAgdG9wbW9zdCgpLm5hdmlnYXRlKG5hdmlnYXRpb25FbnRyeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0ZWRGcm9tKCkge1xuICAgIGFsbGVyZ2VuTGlzdC5jbGVhcigpO1xufSJdfQ==