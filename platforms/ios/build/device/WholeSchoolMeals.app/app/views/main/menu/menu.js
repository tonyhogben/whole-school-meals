"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var frame_1 = require("ui/frame");
var moment = require("moment");
var TimeDatePicker = require("nativescript-timedatepicker");
var menu_vm_1 = require("../../../view-models/menu-vm");
var view, menu = new menu_vm_1.Menu, viewData = observable_1.fromObject({
    date: new Date(),
    displayDate: "Today",
    menu: menu,
    isLoading: true,
    menuError: ""
});
function onViewLoaded(args) {
    view = args.object;
    view.bindingContext = viewData;
    // Set the start date - make sure it is not the weekend, if so, go to Monday
    if (!viewData.get("date")) {
        updateDay(new Date());
    }
    else {
        updateDay(viewData.get("date"));
    }
    //const menuWrapper = <StackLayout>view.getViewById("menuWrapper");
    //menuWrapper.on(GestureTypes.swipe, (args: SwipeGestureEventData) => {
    //    if (args.direction === SwipeDirection.left) {
    //        nextDay();
    //    } else if (args.direction === SwipeDirection.right) {
    //        prevDay();
    //    }
    //});
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
    var menuWrap = view.getViewById("menuWrap");
    menuWrap.animate({
        opacity: 0,
        duration: 200
    });
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
        menuWrap.animate({
            opacity: 1,
            duration: 500
        });
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
function goSide1() {
    goToDish(menu.side1);
}
exports.goSide1 = goSide1;
function goSide2() {
    goToDish(menu.side2);
}
exports.goSide2 = goSide2;
function goSide3() {
    goToDish(menu.side3);
}
exports.goSide3 = goSide3;
function goSide4() {
    goToDish(menu.side4);
}
exports.goSide4 = goSide4;
function goSide5() {
    goToDish(menu.side5);
}
exports.goSide5 = goSide5;
function goDessert1() {
    goToDish(menu.dessert1);
}
exports.goDessert1 = goDessert1;
function goDessert2() {
    goToDish(menu.dessert2);
}
exports.goDessert2 = goDessert2;
function goDessert3() {
    goToDish(menu.dessert3);
}
exports.goDessert3 = goDessert3;
function goDessert4() {
    goToDish(menu.dessert4);
}
exports.goDessert4 = goDessert4;
function goToDish(Dish) {
    frame_1.topmost().navigate({
        moduleName: "views/dish/dish",
        context: Dish
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw4Q0FBd0Y7QUFDeEYsa0NBQW1DO0FBQ25DLCtCQUFpQztBQUNqQyw0REFBOEQ7QUFDOUQsd0RBQW9EO0FBR3BELElBQUksSUFBZ0IsRUFDaEIsSUFBSSxHQUFTLElBQUksY0FBSSxFQUNyQixRQUFRLEdBQWUsdUJBQVUsQ0FBQztJQUM5QixJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsSUFBSSxFQUFFLElBQUk7SUFDVixTQUFTLEVBQUUsSUFBSTtJQUNmLFNBQVMsRUFBRSxFQUFFO0NBQ2hCLENBQUMsQ0FBQztBQUVQLHNCQUE2QixJQUFlO0lBQ3hDLElBQUksR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUMsUUFBUSxDQUFDO0lBRTdCLDRFQUE0RTtJQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLHVFQUF1RTtJQUN2RSxtREFBbUQ7SUFDbkQsb0JBQW9CO0lBQ3BCLDJEQUEyRDtJQUMzRCxvQkFBb0I7SUFDcEIsT0FBTztJQUNQLEtBQUs7QUFDVCxDQUFDO0FBbkJELG9DQW1CQztBQUVELGlCQUF3QixJQUFJO0lBQ3hCLDRCQUE0QjtJQUM1QixJQUFJLFFBQVEsR0FBSSxDQUFDLFVBQUMsSUFBSTtRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1As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QUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUZELDBCQUVDO0FBRUQ7SUFDSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFGRCwwQkFFQztBQUVEO0lBQ0ksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsMEJBRUM7QUFFRDtJQUNJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUZELDBCQUVDO0FBRUQ7SUFDSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFGRCwwQkFFQztBQUVEO0lBQ0ksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsMEJBRUM7QUFFRDtJQUNJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUZELGdDQUVDO0FBRUQ7SUFDSSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFGRCxnQ0FFQztBQUVEO0lBQ0ksUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsZ0NBRUM7QUFFRDtJQUNJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUZELGdDQUVDO0FBRUQsa0JBQWtCLElBQUk7SUFDbEIsZUFBTyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ2YsVUFBVSxFQUFFLGlCQUFpQjtRQUM3QixPQUFPLEVBQUUsSUFBSTtLQUNoQixDQUFDLENBQUM7QUFDUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFdmVudERhdGEsIGZyb21PYmplY3QsIFByb3BlcnR5Q2hhbmdlRGF0YSB9IGZyb20gXCJkYXRhL29ic2VydmFibGVcIjtcbmltcG9ydCB7IHRvcG1vc3QgfSBmcm9tIFwidWkvZnJhbWVcIjtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgKiBhcyBUaW1lRGF0ZVBpY2tlciBmcm9tIFwibmF0aXZlc2NyaXB0LXRpbWVkYXRlcGlja2VyXCI7XG5pbXBvcnQgeyBNZW51IH0gZnJvbSBcIi4uLy4uLy4uL3ZpZXctbW9kZWxzL21lbnUtdm1cIjtcbmltcG9ydCB7IEdlc3R1cmVUeXBlcywgU3dpcGVHZXN0dXJlRXZlbnREYXRhLCBTd2lwZURpcmVjdGlvbiB9IGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuXG52YXIgdmlldzogR3JpZExheW91dCxcbiAgICBtZW51OiBNZW51ID0gbmV3IE1lbnUsXG4gICAgdmlld0RhdGE6IE9ic2VydmFibGUgPSBmcm9tT2JqZWN0KHtcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgZGlzcGxheURhdGU6IFwiVG9kYXlcIixcbiAgICAgICAgbWVudTogbWVudSxcbiAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICBtZW51RXJyb3I6IFwiXCJcbiAgICB9KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uVmlld0xvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcbiAgICB2aWV3ID0gPEdyaWRMYXlvdXQ+YXJncy5vYmplY3Q7XG4gICAgdmlldy5iaW5kaW5nQ29udGV4dD12aWV3RGF0YTtcblxuICAgIC8vIFNldCB0aGUgc3RhcnQgZGF0ZSAtIG1ha2Ugc3VyZSBpdCBpcyBub3QgdGhlIHdlZWtlbmQsIGlmIHNvLCBnbyB0byBNb25kYXlcbiAgICBpZiAoIXZpZXdEYXRhLmdldChcImRhdGVcIikpIHtcbiAgICAgICAgdXBkYXRlRGF5KG5ldyBEYXRlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZURheSh2aWV3RGF0YS5nZXQoXCJkYXRlXCIpKTtcbiAgICB9XG5cbiAgICAvL2NvbnN0IG1lbnVXcmFwcGVyID0gPFN0YWNrTGF5b3V0PnZpZXcuZ2V0Vmlld0J5SWQoXCJtZW51V3JhcHBlclwiKTtcbiAgICAvL21lbnVXcmFwcGVyLm9uKEdlc3R1cmVUeXBlcy5zd2lwZSwgKGFyZ3M6IFN3aXBlR2VzdHVyZUV2ZW50RGF0YSkgPT4ge1xuICAgIC8vICAgIGlmIChhcmdzLmRpcmVjdGlvbiA9PT0gU3dpcGVEaXJlY3Rpb24ubGVmdCkge1xuICAgIC8vICAgICAgICBuZXh0RGF5KCk7XG4gICAgLy8gICAgfSBlbHNlIGlmIChhcmdzLmRpcmVjdGlvbiA9PT0gU3dpcGVEaXJlY3Rpb24ucmlnaHQpIHtcbiAgICAvLyAgICAgICAgcHJldkRheSgpO1xuICAgIC8vICAgIH1cbiAgICAvL30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGlja0RheShhcmdzKSB7XG4gICAgLy9DcmVhdGUgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgIGxldCBjYWxsYmFjayA9ICAoKGRhdGUpID0+IHtcbiAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgIGxldCBuZXdEYXRlID0gbW9tZW50KGRhdGUsIFwiREQgTU0gWVlZWSBoaDptbVwiKS50b0RhdGUoKTs7XG4gICAgICAgICAgICB1cGRhdGVEYXkobmV3RGF0ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vSW5pdGlhbGl6ZSB0aGUgUGlja2VyTWFuYWdlciAoLmluaXQoeW91ckNhbGxiYWNrLCB0aXRsZSwgaW5pdGlhbERhdGUpKVxuICAgIFRpbWVEYXRlUGlja2VyLmluaXQoY2FsbGJhY2ssbnVsbCx2aWV3RGF0YS5nZXQoXCJkYXRlXCIpKTtcblxuICAgIC8vU2hvdyB0aGUgZGlhbG9nXG4gICAgVGltZURhdGVQaWNrZXIuc2hvd0RhdGVQaWNrZXJEaWFsb2coKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZEYXkoKSB7XG4gICAgbGV0IHRoZURheSA9IHZpZXdEYXRhLmdldChcImRhdGVcIik7XG4gICAgdGhlRGF5LnNldERhdGUodGhlRGF5LmdldERhdGUoKSAtIDEpO1xuXG4gICAgaWYgKG1vbWVudCh0aGVEYXkpLndlZWtkYXkoKSA9PSAwKSB7XG4gICAgICAgIHRoZURheS5zZXREYXRlKHRoZURheS5nZXREYXRlKCkgLSAyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEYXkodGhlRGF5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHREYXkoKSB7XG4gICAgbGV0IHRoZURheSA9IHZpZXdEYXRhLmdldChcImRhdGVcIik7XG4gICAgdGhlRGF5LnNldERhdGUodGhlRGF5LmdldERhdGUoKSArIDEpO1xuXG4gICAgaWYgKG1vbWVudCh0aGVEYXkpLndlZWtkYXkoKSA9PSA2KSB7XG4gICAgICAgIHRoZURheS5zZXREYXRlKHRoZURheS5nZXREYXRlKCkgKyAyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEYXkodGhlRGF5KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRGF5KGRhdGUpIHtcbiAgICBsZXQgbWVudVdyYXA6IFN0YWNrTGF5b3V0ID0gPFN0YWNrTGF5b3V0PnZpZXcuZ2V0Vmlld0J5SWQoXCJtZW51V3JhcFwiKTtcbiAgICBtZW51V3JhcC5hbmltYXRlKHtcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgZHVyYXRpb246IDIwMFxuICAgIH0pO1xuXG4gICAgdmlld0RhdGEuc2V0KFwiaXNMb2FkaW5nXCIsIHRydWUpO1xuXG4gICAgaWYgKG1vbWVudChkYXRlKS53ZWVrZGF5KCkgPT0gNikge1xuICAgICAgICAvL1NhdHVyZGF5XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDIpO1xuICAgIH0gZWxzZSBpZiAobW9tZW50KGRhdGUpLndlZWtkYXkoKSA9PSAwKSB7XG4gICAgICAgIC8vU3VuZGF5XG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xuICAgIH1cbiAgICB2aWV3RGF0YS5zZXQoXCJkYXRlXCIsIGRhdGUpO1xuICAgIHZpZXdEYXRhLnNldChcImRpc3BsYXlEYXRlXCIsIGRpc3BsYXlEYXRlKGRhdGUpKTtcblxuICAgIC8vIExvYWQgbWVudSBmb3Igc2VsZWN0ZWQgZGF5XG4gICAgbWVudS5sb2FkKG1vbWVudChkYXRlKS5mb3JtYXQoXCJERC9NTS9ZWVlZXCIpKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICB2aWV3RGF0YS5zZXQoXCJtZW51RXJyb3JcIiwgXCJcIik7XG4gICAgICAgICAgICB2aWV3RGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBtZW51V3JhcC5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBsZXQgc3RyRXJyb3I6IHN0cmluZztcbiAgICAgICAgICAgIGlmIChlcnJvci50b1N0cmluZygpLmluY2x1ZGVzKFwiNTU1XCIpKSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIlRoZXJlIGlzIG5vIG1lbnUgaW5mb3JtYXRpb24gYXZhaWxhYmxlIGZvciB0aGlzIGRheSB5ZXQsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnRvU3RyaW5nKCkuaW5jbHVkZXMoXCJvZmZsaW5lXCIpKSB7XG4gICAgICAgICAgICAgICAgc3RyRXJyb3IgPSBcIllvdSBkbyBub3QgYXBwZWFyIHRvIGhhdmUgYW4gSW50ZXJuZXQgQ29ubmVjdGlvbiwgcGxlYXNlIHRyeSBhZ2FpbiB3aGVuIHlvdSBhcmUgY29ubmVjdGVkLlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJFcnJvciA9IFwiV2UgYXBwZWFyIHRvIGJlIGhhdmluZyB0cm91YmxlIGdldHRpbmcgdGhlIG1lbnUgaW5mb3JtYXRpb24gZm9yIHRoaXMgZGF5IGF0IHRoZSBtb21lbnQsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZpZXdEYXRhLnNldChcIm1lbnVFcnJvclwiLCBzdHJFcnJvcik7XG4gICAgICAgICAgICB2aWV3RGF0YS5zZXQoXCJpc0xvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheURhdGUoZGF0ZSkge1xuICAgIHJldHVybiAobW9tZW50KGRhdGUpLmNhbGVuZGFyKG51bGwsIHtzYW1lRWxzZTogJ0REL01NL1lZWVknfSkuc3BsaXQoXCIgYXRcIikpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29NYWluMSgpIHtcbiAgICBnb1RvRGlzaChtZW51Lm1haW4xKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvTWFpbjIoKSB7XG4gICAgZ29Ub0Rpc2gobWVudS5tYWluMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnb1NpZGUxKCkge1xuICAgIGdvVG9EaXNoKG1lbnUuc2lkZTEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29TaWRlMigpIHtcbiAgICBnb1RvRGlzaChtZW51LnNpZGUyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvU2lkZTMoKSB7XG4gICAgZ29Ub0Rpc2gobWVudS5zaWRlMyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnb1NpZGU0KCkge1xuICAgIGdvVG9EaXNoKG1lbnUuc2lkZTQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29TaWRlNSgpIHtcbiAgICBnb1RvRGlzaChtZW51LnNpZGU1KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvRGVzc2VydDEoKSB7XG4gICAgZ29Ub0Rpc2gobWVudS5kZXNzZXJ0MSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnb0Rlc3NlcnQyKCkge1xuICAgIGdvVG9EaXNoKG1lbnUuZGVzc2VydDIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ29EZXNzZXJ0MygpIHtcbiAgICBnb1RvRGlzaChtZW51LmRlc3NlcnQzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdvRGVzc2VydDQoKSB7XG4gICAgZ29Ub0Rpc2gobWVudS5kZXNzZXJ0NCk7XG59XG5cbmZ1bmN0aW9uIGdvVG9EaXNoKERpc2gpIHtcbiAgICB0b3Btb3N0KCkubmF2aWdhdGUoe1xuICAgICAgICBtb2R1bGVOYW1lOiBcInZpZXdzL2Rpc2gvZGlzaFwiLFxuICAgICAgICBjb250ZXh0OiBEaXNoXG4gICAgfSk7XG59Il19