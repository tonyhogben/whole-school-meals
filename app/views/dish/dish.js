"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../shared/models");
var platform_1 = require("tns-core-modules/platform");
var frame_1 = require("ui/frame");
var timer_1 = require("timer");
var moment = require("moment");
var dish, page;
function onLoaded(args) {
    page = args.object;
    dish = page.navigationContext;
    page.bindingContext = dish;
    // get the menu date and see if we should show the feedback panel
    var feedbackPanel = (page.getViewById("feedbackPanel"));
    if (moment(dish.menuDate).isSame(moment(), 'day')) {
        if (moment(moment()).isAfter(moment('13:00', 'hh:mm'))) {
            // They have had lunch - show
            feedbackPanel.visibility = "visible";
        }
        else {
            // They have not had lunch yet - hide
            feedbackPanel.visibility = "collapse";
        }
    }
    else if (moment(dish.menuDate).isBefore(moment())) {
        // In the past - show
        feedbackPanel.visibility = "visible";
    }
    else {
        // In the future - hide
        feedbackPanel.visibility = "collapse";
    }
}
exports.onLoaded = onLoaded;
function back() {
    frame_1.goBack();
}
exports.back = back;
function showImage(args) {
    var tappedView = args.view, tappedItem = tappedView.bindingContext, mainPhoto = (page.getViewById("mainPhoto"));
    mainPhoto.src = tappedItem.url;
}
exports.showImage = showImage;
function fbYes() {
    sendFeedback(true);
}
exports.fbYes = fbYes;
function fbNo() {
    sendFeedback(false);
}
exports.fbNo = fbNo;
function sendFeedback(Feedback) {
    // Get the buttons by ID and set their isUserInteractionEnabled="false" so they cannot be double clicked
    var feedbackLabel = (page.getViewById("feedbackLabel")), feedbackBtnYes = (page.getViewById("feedbackBtnYes")), feedbackBtnNo = (page.getViewById("feedbackBtnNo"));
    feedbackBtnYes.isUserInteractionEnabled = false;
    feedbackBtnNo.isUserInteractionEnabled = false;
    feedbackBtnYes.className = "fa loading";
    feedbackBtnNo.className = "fa loading";
    // Change label to read "Sending your feedback" and add an activity indicator
    feedbackLabel.text = "Sending your feedback";
    // Once complete, hide the buttons (and the bottom label) and change the main label to read "Thank you, your feedback has been sent"
    var id = timer_1.setTimeout(function () {
        fetch(models_1.Config.apiUrl + "feedback.ashx", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                DishID: dish.id,
                CalendarID: dish.calendarId,
                Feedback: Feedback ? 1 : 0,
                IPAddress: '',
                UserAgent: platform_1.device.model + ', ' + platform_1.device.deviceType + ', ' + platform_1.device.os + ', ' + platform_1.device.osVersion + ', ' + platform_1.device.sdkVersion,
                DeviceID: platform_1.device.uuid
            })
        }).then(handleErrors)
            .then(function (response) {
            //console.dir(response);
            return response.json();
        }).then(function (response) {
            var id = timer_1.setTimeout(function () {
                feedbackLabel.text = "Thank you, your feedback has been sent";
                var id = timer_1.setTimeout(function () {
                    // Re-enable the buttons and change the message again
                    feedbackLabel.text = "Did another child enjoy this dish?";
                    feedbackBtnYes.isUserInteractionEnabled = true;
                    feedbackBtnNo.isUserInteractionEnabled = true;
                    feedbackBtnYes.className = "fa";
                    feedbackBtnNo.className = "fa";
                }, 1500);
            }, 1000);
        }).catch(function () {
            feedbackLabel.text = "Did your child enjoy this dish?";
            feedbackBtnYes.isUserInteractionEnabled = true;
            feedbackBtnNo.isUserInteractionEnabled = true;
            feedbackBtnYes.className = "fa";
            feedbackBtnNo.className = "fa";
            alert("Something has gone wrong. Please make sure you have an internet connection and try again.");
        });
    }, 1000);
}
function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4Q0FBbUQ7QUFDbkQsc0RBQTBEO0FBQzFELGtDQUEyQztBQUkzQywrQkFBbUM7QUFFbkMsK0JBQWlDO0FBRWpDLElBQUksSUFBVSxFQUNWLElBQVUsQ0FBQztBQUdmLGtCQUF5QixJQUFlO0lBQ3BDLElBQUksR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBQyxJQUFJLENBQUM7SUFFekIsaUVBQWlFO0lBQ2pFLElBQUksYUFBYSxHQUEyQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUVoRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsNkJBQTZCO1lBQzdCLGFBQWEsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLHFDQUFxQztZQUNyQyxhQUFhLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUMxQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxxQkFBcUI7UUFDckIsYUFBYSxDQUFDLFVBQVUs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d0JBQXdCLEdBQUMsSUFBSSxDQUFDO29CQUU1QyxjQUFjLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQztvQkFDOUIsYUFBYSxDQUFDLFNBQVMsR0FBQyxJQUFJLENBQUM7Z0JBQ2pDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNMLGFBQWEsQ0FBQyxJQUFJLEdBQUMsaUNBQWlDLENBQUM7WUFFckQsY0FBYyxDQUFDLHdCQUF3QixHQUFDLElBQUksQ0FBQztZQUM3QyxhQUFhLENBQUMsd0JBQXdCLEdBQUMsSUFBSSxDQUFDO1lBRTVDLGNBQWMsQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDO1lBQzlCLGFBQWEsQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDO1lBRTdCLEtBQUssQ0FBQywyRkFBMkYsQ0FBQyxDQUFDO1FBQ3ZHLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVELHNCQUFzQixRQUFRO0lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xuaW1wb3J0IHsgQ29uZmlnLCBEaXNoIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVscyc7XG5pbXBvcnQgeyBpc0lPUywgZGV2aWNlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcbmltcG9ydCB7IHRvcG1vc3QsIGdvQmFjayB9IGZyb20gXCJ1aS9mcmFtZVwiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwidWkvaW1hZ2VcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcInVpL2xhYmVsXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwidWkvYnV0dG9uXCI7XG5pbXBvcnQgeyBzZXRUaW1lb3V0IH0gZnJvbSBcInRpbWVyXCI7XG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5cbnZhciBkaXNoOiBEaXNoLFxuICAgIHBhZ2U6IFBhZ2U7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIHBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcbiAgICBkaXNoID0gcGFnZS5uYXZpZ2F0aW9uQ29udGV4dDtcbiAgICBwYWdlLmJpbmRpbmdDb250ZXh0PWRpc2g7XG5cbiAgICAvLyBnZXQgdGhlIG1lbnUgZGF0ZSBhbmQgc2VlIGlmIHdlIHNob3VsZCBzaG93IHRoZSBmZWVkYmFjayBwYW5lbFxuICAgIGxldCBmZWVkYmFja1BhbmVsOiBHcmlkTGF5b3V0ID0gPEdyaWRMYXlvdXQ+KHBhZ2UuZ2V0Vmlld0J5SWQoXCJmZWVkYmFja1BhbmVsXCIpKTtcblxuICAgIGlmIChtb21lbnQoZGlzaC5tZW51RGF0ZSkuaXNTYW1lKG1vbWVudCgpLCAnZGF5JykpIHtcbiAgICAgICAgaWYgKG1vbWVudChtb21lbnQoKSkuaXNBZnRlcihtb21lbnQoJzEzOjAwJywgJ2hoOm1tJykpKSB7XG4gICAgICAgICAgICAvLyBUaGV5IGhhdmUgaGFkIGx1bmNoIC0gc2hvd1xuICAgICAgICAgICAgZmVlZGJhY2tQYW5lbC52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGV5IGhhdmUgbm90IGhhZCBsdW5jaCB5ZXQgLSBoaWRlXG4gICAgICAgICAgICBmZWVkYmFja1BhbmVsLnZpc2liaWxpdHkgPSBcImNvbGxhcHNlXCI7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1vbWVudChkaXNoLm1lbnVEYXRlKS5pc0JlZm9yZShtb21lbnQoKSkpIHtcbiAgICAgICAgLy8gSW4gdGhlIHBhc3QgLSBzaG93XG4gICAgICAgIGZlZWRiYWNrUGFuZWwudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluIHRoZSBmdXR1cmUgLSBoaWRlXG4gICAgICAgIGZlZWRiYWNrUGFuZWwudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYWNrKCkge1xuICAgIGdvQmFjaygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0ltYWdlKGFyZ3MpIHtcbiAgICBsZXQgdGFwcGVkVmlldyA9IGFyZ3MudmlldyxcbiAgICAgICAgdGFwcGVkSXRlbSA9IHRhcHBlZFZpZXcuYmluZGluZ0NvbnRleHQsXG4gICAgICAgIG1haW5QaG90bzogSW1hZ2UgPSA8SW1hZ2U+KHBhZ2UuZ2V0Vmlld0J5SWQoXCJtYWluUGhvdG9cIikpO1xuICAgIFxuICAgIG1haW5QaG90by5zcmMgPSB0YXBwZWRJdGVtLnVybDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZiWWVzKCkge1xuICAgIHNlbmRGZWVkYmFjayh0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZiTm8oKSB7XG4gICAgc2VuZEZlZWRiYWNrKGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gc2VuZEZlZWRiYWNrKEZlZWRiYWNrOiBib29sZWFuKSB7XG4gICAgLy8gR2V0IHRoZSBidXR0b25zIGJ5IElEIGFuZCBzZXQgdGhlaXIgaXNVc2VySW50ZXJhY3Rpb25FbmFibGVkPVwiZmFsc2VcIiBzbyB0aGV5IGNhbm5vdCBiZSBkb3VibGUgY2xpY2tlZFxuICAgIGxldCBmZWVkYmFja0xhYmVsOiBMYWJlbCA9IDxMYWJlbD4ocGFnZS5nZXRWaWV3QnlJZChcImZlZWRiYWNrTGFiZWxcIikpLFxuICAgICAgICBmZWVkYmFja0J0blllczogQnV0dG9uID0gPEJ1dHRvbj4ocGFnZS5nZXRWaWV3QnlJZChcImZlZWRiYWNrQnRuWWVzXCIpKSxcbiAgICAgICAgZmVlZGJhY2tCdG5ObzogQnV0dG9uID0gPEJ1dHRvbj4ocGFnZS5nZXRWaWV3QnlJZChcImZlZWRiYWNrQnRuTm9cIikpO1xuXG4gICAgZmVlZGJhY2tCdG5ZZXMuaXNVc2VySW50ZXJhY3Rpb25FbmFibGVkPWZhbHNlO1xuICAgIGZlZWRiYWNrQnRuTm8uaXNVc2VySW50ZXJhY3Rpb25FbmFibGVkPWZhbHNlO1xuICAgIFxuICAgIGZlZWRiYWNrQnRuWWVzLmNsYXNzTmFtZT1cImZhIGxvYWRpbmdcIjtcbiAgICBmZWVkYmFja0J0bk5vLmNsYXNzTmFtZT1cImZhIGxvYWRpbmdcIjtcblxuICAgIC8vIENoYW5nZSBsYWJlbCB0byByZWFkIFwiU2VuZGluZyB5b3VyIGZlZWRiYWNrXCIgYW5kIGFkZCBhbiBhY3Rpdml0eSBpbmRpY2F0b3JcbiAgICBmZWVkYmFja0xhYmVsLnRleHQ9XCJTZW5kaW5nIHlvdXIgZmVlZGJhY2tcIjtcblxuICAgIC8vIE9uY2UgY29tcGxldGUsIGhpZGUgdGhlIGJ1dHRvbnMgKGFuZCB0aGUgYm90dG9tIGxhYmVsKSBhbmQgY2hhbmdlIHRoZSBtYWluIGxhYmVsIHRvIHJlYWQgXCJUaGFuayB5b3UsIHlvdXIgZmVlZGJhY2sgaGFzIGJlZW4gc2VudFwiXG4gICAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZmV0Y2goQ29uZmlnLmFwaVVybCArIFwiZmVlZGJhY2suYXNoeFwiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBcbiAgICAgICAgICAgICAgICAgICAgRGlzaElEOiBkaXNoLmlkLCBcbiAgICAgICAgICAgICAgICAgICAgQ2FsZW5kYXJJRDogZGlzaC5jYWxlbmRhcklkLFxuICAgICAgICAgICAgICAgICAgICBGZWVkYmFjazogRmVlZGJhY2sgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgSVBBZGRyZXNzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgVXNlckFnZW50OiBkZXZpY2UubW9kZWwgKyAnLCAnICsgZGV2aWNlLmRldmljZVR5cGUgKyAnLCAnICsgZGV2aWNlLm9zICsgJywgJyArIGRldmljZS5vc1ZlcnNpb24gKyAnLCAnICsgZGV2aWNlLnNka1ZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIERldmljZUlEOiBkZXZpY2UudXVpZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KS50aGVuKGhhbmRsZUVycm9ycylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmRpcihyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrTGFiZWwudGV4dD1cIlRoYW5rIHlvdSwgeW91ciBmZWVkYmFjayBoYXMgYmVlbiBzZW50XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlLWVuYWJsZSB0aGUgYnV0dG9ucyBhbmQgY2hhbmdlIHRoZSBtZXNzYWdlIGFnYWluXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWVkYmFja0xhYmVsLnRleHQ9XCJEaWQgYW5vdGhlciBjaGlsZCBlbmpveSB0aGlzIGRpc2g/XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrQnRuWWVzLmlzVXNlckludGVyYWN0aW9uRW5hYmxlZD10cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmVlZGJhY2tCdG5Oby5pc1VzZXJJbnRlcmFjdGlvbkVuYWJsZWQ9dHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmVlZGJhY2tCdG5ZZXMuY2xhc3NOYW1lPVwiZmFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrQnRuTm8uY2xhc3NOYW1lPVwiZmFcIjtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0xhYmVsLnRleHQ9XCJEaWQgeW91ciBjaGlsZCBlbmpveSB0aGlzIGRpc2g/XCI7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmVlZGJhY2tCdG5ZZXMuaXNVc2VySW50ZXJhY3Rpb25FbmFibGVkPXRydWU7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tCdG5Oby5pc1VzZXJJbnRlcmFjdGlvbkVuYWJsZWQ9dHJ1ZTtcblxuICAgICAgICAgICAgICAgIGZlZWRiYWNrQnRuWWVzLmNsYXNzTmFtZT1cImZhXCI7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tCdG5Oby5jbGFzc05hbWU9XCJmYVwiO1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTb21ldGhpbmcgaGFzIGdvbmUgd3JvbmcuIFBsZWFzZSBtYWtlIHN1cmUgeW91IGhhdmUgYW4gaW50ZXJuZXQgY29ubmVjdGlvbiBhbmQgdHJ5IGFnYWluLlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sIDEwMDApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVFcnJvcnMocmVzcG9uc2UpIHtcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG59Il19