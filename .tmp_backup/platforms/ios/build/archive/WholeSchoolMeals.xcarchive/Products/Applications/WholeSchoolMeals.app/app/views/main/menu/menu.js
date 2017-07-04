"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var frame_1 = require("ui/frame");
var moment = require("moment");
var TimeDatePicker = require("nativescript-timedatepicker");
var menu_vm_1 = require("../../../view-models/menu-vm");
var menu = new menu_vm_1.Menu;
var viewData = observable_1.fromObject({
    date: new Date(),
    displayDate: "Today",
    menu: menu,
    isLoading: true,
    menuError: ""
});
function onViewLoaded(args) {
    var view = args.object;
    view.bindingContext = viewData;
    // Set the start date - make sure it is not the weekend, if so, go to Monday
    if (!viewData.get("date")) {
        updateDay(new Date());
    }
    else {
        updateDay(viewData.get("date"));
    }
}
exports.onViewLoaded = onViewLoaded;
function pickDay(args) {
    //Create a callback function
    var callback = (function (date) {
        if (date) {
            var newDate = moment(date, "DD MM YYYY hh:mm").toDate();
            ;
            updateDay(newDate);
        }
    });
    //Initialize the PickerManager (.init(yourCallback, title, initialDate))
    TimeDatePicker.init(callback, null, viewData.get("date"));
    //Show the dialog
    TimeDatePicker.showDatePickerDialog();
}
exports.pickDay = pickDay;
function prevDay() {
    var theDay = viewData.get("date");
    theDay.setDate(theDay.getDate() - 1);
    if (moment(theDay).weekday() == 0) {
        theDay.setDate(theDay.getDate() - 2);
    }
    updateDay(theDay);
}
exports.prevDay = prevDay;
function nextDay() {
    var theDay = viewData.get("date");
    theDay.setDate(theDay.getDate() + 1);
    if (moment(theDay).weekday() == 6) {
        theDay.setDate(theDay.getDate() + 2);
    }
    updateDay(theDay);
}
exports.nextDay = nextDay;
function updateDay(date) {
    viewData.set("isLoading", true);
    if (moment(date).weekday() == 6) {
        //Saturday
        date.setDate(date.getDate() + 2);
    }
    else if (moment(date).weekday() == 0) {
        //Sunday
        date.setDate(date.getDate() + 1);
    }
    viewData.set("date", date);
    viewData.set("displayDate", displayDate(date));
    // Load menu for selected day
    menu.load(moment(date).format("DD/MM/YYYY"))
        .then(function () {
        viewData.set("menuError", "");
        viewData.set("isLoading", false);
    }).catch(function (error) {
        var strError;
        if (error.toString().includes("555")) {
            strError = "There is no menu information available for this day yet, please try again later.";
        }
        else if (error.toString().includes("offline")) {
            strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
        }
        else {
            strError = "We appear to be having trouble getting the menu information for this day at the moment, please try again later.";
        }
        viewData.set("menuError", strError);
        viewData.set("isLoading", false);
    });
}
function displayDate(date) {
    return (moment(date).calendar(null, { sameElse: 'DD/MM/YYYY' }).split(" at"))[0];
}
function goMain1() {
    goToDish(menu.main1);
}
exports.goMain1 = goMain1;
function goMain2() {
    goToDish(menu.main2);
}
exports.goMain2 = goMain2;
function goToDish(Dish) {
    frame_1.topmost().navigate({
        moduleName: "views/dish/dish",
        context: Dish
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw4Q0FBd0Y7QUFDeEYsa0NBQW1DO0FBQ25DLCtCQUFpQztBQUNqQyw0REFBOEQ7QUFDOUQsd0RBQW9EO0FBRXBELElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDO0FBQ3BCLElBQUksUUFBUSxHQUFlLHVCQUFVLENBQUM7SUFDbEMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLElBQUksRUFBRSxJQUFJO0lBQ1YsU0FBUyxFQUFFLElBQUk7SUFDZixTQUFTLEVBQUUsRUFBRTtDQUNoQixDQUFDLENBQUM7QUFFSCxzQkFBNkIsSUFBZTtJQUN4QyxJQUFNLElBQUksR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUMsUUFBUSxDQUFDO0lBRTdCLDRFQUE0RTtJQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0FBQ0wsQ0FBQztBQVZELG9DQVVDO0FBRUQsaUJBQXdCLElBQUk7SUFDeEIsNEJBQTRCO0lBQzVCLElBQUksUUFBUSxHQUFJLENBQUMsVUFBQyxJQUFJO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFBQSxDQUFDO1lBQ3pELFNBQVMsQ0FBQyxPQUFP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QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsUUFBUSxHQUFHLDRGQUE0RixDQUFDO1FBQzVHLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFFBQVEsR0FBRyxpSEFBaUgsQ0FBQztRQUNqSSxDQUFDO1FBRUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQscUJBQXFCLElBQUk7SUFDckIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBRUQ7SUFDSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFGRCwwQkFFQztBQUVEO0lBQ0ksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsMEJBRUM7QUFFRCxrQkFBa0IsSUFBSTtJQUNsQixlQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDZixVQUFVLEVBQUUsaUJBQWlCO1FBQzdCLE9BQU8sRUFBRSxJQUFJO0tBQ2hCLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IEdyaWRMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9ncmlkLWxheW91dFwiO1xuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcbmltcG9ydCB7IE9ic2VydmFibGUsIEV2ZW50RGF0YSwgZnJvbU9iamVjdCwgUHJvcGVydHlDaGFuZ2VEYXRhIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xuaW1wb3J0IHsgdG9wbW9zdCB9IGZyb20gXCJ1aS9mcmFtZVwiO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCAqIGFzIFRpbWVEYXRlUGlja2VyIGZyb20gXCJuYXRpdmVzY3JpcHQtdGltZWRhdGVwaWNrZXJcIjtcbmltcG9ydCB7IE1lbnUgfSBmcm9tIFwiLi4vLi4vLi4vdmlldy1tb2RlbHMvbWVudS12bVwiO1xuXG52YXIgbWVudSA9IG5ldyBNZW51O1xudmFyIHZpZXdEYXRhOiBPYnNlcnZhYmxlID0gZnJvbU9iamVjdCh7XG4gICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICBkaXNwbGF5RGF0ZTogXCJUb2RheVwiLFxuICAgIG1lbnU6IG1lbnUsXG4gICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgIG1lbnVFcnJvcjogXCJcIlxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBvblZpZXdMb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XG4gICAgY29uc3QgdmlldyA9IDxHcmlkTGF5b3V0PmFyZ3Mub2JqZWN0O1xuICAgIHZpZXcuYmluZGluZ0NvbnRleHQ9dmlld0RhdGE7XG5cbiAgICAvLyBTZXQgdGhlIHN0YXJ0IGRhdGUgLSBtYWtlIHN1cmUgaXQgaXMgbm90IHRoZSB3ZWVrZW5kLCBpZiBzbywgZ28gdG8gTW9uZGF5XG4gICAgaWYgKCF2aWV3RGF0YS5nZXQoXCJkYXRlXCIpKSB7XG4gICAgICAgIHVwZGF0ZURheShuZXcgRGF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVEYXkodmlld0RhdGEuZ2V0KFwiZGF0ZVwiKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGlja0RheShhcmdzKSB7XG4gICAgLy9DcmVhdGUgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgIGxldCBjYWxsYmFjayA9ICAoKGRhdGUpID0+IHtcbiAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgIGxldCBuZXdEYXRlID0gbW9tZW50KGRhdGUsIFwiREQgTU0gWVlZWSBoaDptbVwiKS50b0RhdGUoKTs7XG4gICAgICAgICAgICB1cGRhdGVEYXkobmV3RGF0ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vSW5pdGlhbGl6ZSB0aGUgUGlja2VyTWFuYWdlciAoLmluaXQoeW91ckNhbGxiYWNrLCB0aXRsZSwgaW5pdGlhbERhdGUpKVxuICAgIFRpbWVEYXRlUGlja2VyLmluaXQoY2FsbGJhY2ssbnVsbCx2aWV3RGF0YS5nZXQoXCJkYXRlXCIpKTtcblxuICAgIC8vU2hvdyB0aGUgZGlhbG9nXG4gICAgVGltZURhdGVQaWNrZXIuc2hvd0RhdGVQaWNrZXJEaWFsb2coKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZEYXkoKSB7XG4gICAgbGV0IHRoZURheSA9IHZpZXdEYXRhLmdldChcImRhdGVcIik7XG4gICAgdGhlRGF5LnNldERhdGUodGhlRGF5LmdldERhdGUoKSAtIDEpO1xuXG4gICAgaWYgKG1vbWVudCh0aGVEYXkpLndlZWtkYXkoKSA9PSAwKSB7XG4gICAgICAgIHRoZURheS5zZXREYXRlKHRoZURheS5nZXREYXRlKCkgLSAyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEYXkodGhlRGF5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHREYXkoKSB7XG4gICAgbGV0IHRoZURheSA9IHZpZXdEYXRhLmdldChcImRhdGVcIik7XG4gICAgdGhlRGF5LnNldERhdGUodGhlRGF5LmdldERhdGUoKSArIDEpO1xuXG4gICAgaWYgKG1vbWVudCh0aGVEYXkpLndlZWtkYXkoKSA9PSA2KSB7XG4gICAgICAgIHRoZURheS5zZXREYXRlKHRoZURheS5nZXREYXRlKCkgKyAyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEYXkodGhlRGF5KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGF5KGRhdGUpIHtcbiAgICB2aWV3RGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgdHJ1ZSk7XG5cbiAgICBpZiAobW9tZW50KGRhdGUpLndlZWtkYXkoKSA9PSA2KSB7XG4gICAgICAgIC8vU2F0dXJkYXlcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMik7XG4gICAgfSBlbHNlIGlmIChtb21lbnQoZGF0ZSkud2Vla2RheSgpID09IDApIHtcbiAgICAgICAgLy9TdW5kYXlcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XG4gICAgfVxuICAgIHZpZXdEYXRhLnNldChcImRhdGVcIiwgZGF0ZSk7XG4gICAgdmlld0RhdGEuc2V0KFwiZGlzcGxheURhdGVcIiwgZGlzcGxheURhdGUoZGF0ZSkpO1xuXG4gICAgLy8gTG9hZCBtZW51IGZvciBzZWxlY3RlZCBkYXlcbiAgICBtZW51LmxvYWQobW9tZW50KGRhdGUpLmZvcm1hdChcIkREL01NL1lZWVlcIikpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHZpZXdEYXRhLnNldChcIm1lbnVFcnJvclwiLCBcIlwiKTtcbiAgICAgICAgICAgIHZpZXdEYXRhLnNldChcImlzTG9hZGluZ1wiLCBmYWxzZSk7IFxuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBsZXQgc3RyRXJyb3I6IHN0cmluZztcbiAgICAgICAgICAgIGlmIChlcnJvci50b1N0cmluZygpLmluY2x1ZGVzKFwiNTU1XCIpKSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIlRoZXJlIGlzIG5vIG1lbnUgaW5mb3JtYXRpb24gYXZhaWxhYmxlIGZvciB0aGlzIGRheSB5ZXQsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnRvU3RyaW5nKCkuaW5jbHVkZXMoXCJvZmZsaW5lXCIpKSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIllvdSBkbyBub3QgYXBwZWFyIHRvIGhhdmUgYW4gSW50ZXJuZXQgQ29ubmVjdGlvbiwgcGxlYXNlIHRyeSBhZ2FpbiB3aGVuIHlvdSBhcmUgY29ubmVjdGVkLlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJFcnJvciA9IFwiV2UgYXBwZWFyIHRvIGJlIGhhdmluZyB0cm91YmxlIGdldHRpbmcgdGhlIG1lbnUgaW5mb3JtYXRpb24gZm9yIHRoaXMgZGF5IGF0IHRoZSBtb21lbnQsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdEYXRhLnNldChcIm1lbnVFcnJvclwiLCBzdHJFcnJvcik7XG4gICAgICAgICAgICB2aWV3RGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZSkge1xuICAgIHJldHVybiAobW9tZW50KGRhdGUpLmNhbGVuZGFyKG51bGwsIHtzYW1lRWxzZTogJ0REL01NL1lZWVknfSkuc3BsaXQoXCIgYXRcIikpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29NYWluMSgpIHtcbiAgICBnb1RvRGlzaChtZW51Lm1haW4xKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvTWFpbjIoKSB7XG4gICAgZ29Ub0Rpc2gobWVudS5tYWluMik7XG59XG5cbmZ1bmN0aW9uIGdvVG9EaXNoKERpc2gpIHtcbiAgICB0b3Btb3N0KCkubmF2aWdhdGUoe1xuICAgICAgICBtb2R1bGVOYW1lOiBcInZpZXdzL2Rpc2gvZGlzaFwiLFxuICAgICAgICBjb250ZXh0OiBEaXNoXG4gICAgfSk7XG59Il19