"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("data/observable");
var web_view_1 = require("ui/web-view");
var platform_1 = require("tns-core-modules/platform");
var viewData = observable_1.fromObject({
    paymentPageLoading: true
});
function onViewLoaded(args) {
    var view = args.object;
    view.bindingContext = viewData;
    viewData.set("paymentPageLoading", true);
    var webView = view.getViewById("paymentPage");
    webView.on(web_view_1.WebView.loadFinishedEvent, function (args) {
        if (args.error) {
            webView.src = "<html><style>* { font-family: Arial, Helvetica, sans-serif; }</style><body>You must have an Internet connection to make a payment</body></html>";
        }
        else {
            viewData.set("paymentPageLoading", false);
            //console.log("WebView Width: " + webView.width);
            //console.log("WebView getMeasuredWidth: " + webView.getMeasuredWidth());
            //console.log("WebView effectiveWidth: " + webView.effectiveWidth);
            //console.log("Screen width: " + screen.mainScreen.widthPixels);
            //console.log("Screen scale: " + screen.mainScreen.scale);
            if (platform_1.isAndroid) {
                var pageWidth = 800 + 20, // width of page plus some padding
                screenWidth = platform_1.screen.mainScreen.widthPixels;
                var scale = (screenWidth / pageWidth) * 100;
                webView.android.setInitialScale(scale);
            }
            if (platform_1.isIOS) {
                //webView.ios.scrollView.zoomScale = 1;
                //webView.ios.scalesPageToFit = true;
            }
        }
    });
    webView.src = "http://www.parentpayshop.com/schools/wsm/index.htm";
}
exports.onViewLoaded = onViewLoaded;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5iYWsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXltZW50LmJhay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUFvRTtBQUNwRSx3Q0FBcUQ7QUFJckQsc0RBQXFFO0FBR3JFLElBQUksUUFBUSxHQUFlLHVCQUFVLENBQUM7SUFDbEMsa0JBQWtCLEVBQUUsSUFBSTtDQUMzQixDQUFDLENBQUM7QUFFSCxzQkFBNkIsSUFBZTtJQUN4QyxJQUFNLElBQUksR0FBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNqRCxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztJQUUvQixRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXpDLElBQUksT0FBTyxHQUFxQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRWhFLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQU8sQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLElBQW1CO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsR0FBRyxpSkFBaUosQ0FBQTtRQUNuSyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTFDLGlEQUFpRDtZQUNqRCx5RUFBeUU7WUFDekUsbUVBQW1FO1lBQ25FLGdFQUFnRTtZQUNoRSwwREFBMEQ7WUFFMUQsRUFBRSxDQUFDLENBQUUsb0JBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxTQUFTLEdBQVcsR0FBRyxHQUFHLEVBQUUsRUFBRSxrQ0FBa0M7Z0JBQ2hFLFdBQVcsR0FBVyxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7Z0JBRXhELElBQUksS0FBSyxHQUFXLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFcEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFFLGdCQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNWLHVDQUF1QztnQkFDdkMscUNBQXFDO1lBQ3pDLENBQUM7UUFFTCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxHQUFHLG9EQUFvRCxDQUFDO0FBQ3ZFLENBQUM7QUF0Q0Qsb0NBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBFdmVudERhdGEsIGZyb21PYmplY3QsIE9ic2VydmFibGUgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBXZWJWaWV3LCBMb2FkRXZlbnREYXRhIH0gZnJvbSBcInVpL3dlYi12aWV3XCI7XG5pbXBvcnQgeyB0b3Btb3N0IH0gZnJvbSBcInVpL2ZyYW1lXCI7XG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XG5pbXBvcnQgeyBpc0lPUywgaXNBbmRyb2lkLCBzY3JlZW4gfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuaW1wb3J0IHsgc2V0VGltZW91dCB9IGZyb20gXCJ0aW1lclwiO1xuXG52YXIgdmlld0RhdGE6IE9ic2VydmFibGUgPSBmcm9tT2JqZWN0KHtcbiAgICBwYXltZW50UGFnZUxvYWRpbmc6IHRydWVcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gb25WaWV3TG9hZGVkKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIGNvbnN0IHZpZXc6IEdyaWRMYXlvdXQgPSA8R3JpZExheW91dD5hcmdzLm9iamVjdDtcbiAgICB2aWV3LmJpbmRpbmdDb250ZXh0ID0gdmlld0RhdGE7XG5cbiAgICB2aWV3RGF0YS5zZXQoXCJwYXltZW50UGFnZUxvYWRpbmdcIiwgdHJ1ZSk7XG5cbiAgICBsZXQgd2ViVmlldzogV2ViVmlldyA9IDxXZWJWaWV3PnZpZXcuZ2V0Vmlld0J5SWQoXCJwYXltZW50UGFnZVwiKTtcblxuICAgIHdlYlZpZXcub24oV2ViVmlldy5sb2FkRmluaXNoZWRFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IExvYWRFdmVudERhdGEpIHtcbiAgICAgICAgaWYgKGFyZ3MuZXJyb3IpIHtcbiAgICAgICAgICAgIHdlYlZpZXcuc3JjID0gXCI8aHRtbD48c3R5bGU+KiB7IGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmOyB9PC9zdHlsZT48Ym9keT5Zb3UgbXVzdCBoYXZlIGFuIEludGVybmV0IGNvbm5lY3Rpb24gdG8gbWFrZSBhIHBheW1lbnQ8L2JvZHk+PC9odG1sPlwiXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3RGF0YS5zZXQoXCJwYXltZW50UGFnZUxvYWRpbmdcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiV2ViVmlldyBXaWR0aDogXCIgKyB3ZWJWaWV3LndpZHRoKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJXZWJWaWV3IGdldE1lYXN1cmVkV2lkdGg6IFwiICsgd2ViVmlldy5nZXRNZWFzdXJlZFdpZHRoKCkpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIldlYlZpZXcgZWZmZWN0aXZlV2lkdGg6IFwiICsgd2ViVmlldy5lZmZlY3RpdmVXaWR0aCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiU2NyZWVuIHdpZHRoOiBcIiArIHNjcmVlbi5tYWluU2NyZWVuLndpZHRoUGl4ZWxzKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJTY3JlZW4gc2NhbGU6IFwiICsgc2NyZWVuLm1haW5TY3JlZW4uc2NhbGUpO1xuXG4gICAgICAgICAgICBpZiAoIGlzQW5kcm9pZCApIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFnZVdpZHRoOiBudW1iZXIgPSA4MDAgKyAyMCwgLy8gd2lkdGggb2YgcGFnZSBwbHVzIHNvbWUgcGFkZGluZ1xuICAgICAgICAgICAgICAgICAgICBzY3JlZW5XaWR0aDogbnVtYmVyID0gc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhQaXhlbHM7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2NhbGU6IG51bWJlciA9IChzY3JlZW5XaWR0aCAvIHBhZ2VXaWR0aCkgKiAxMDA7XG5cbiAgICAgICAgICAgICAgICB3ZWJWaWV3LmFuZHJvaWQuc2V0SW5pdGlhbFNjYWxlKHNjYWxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBpc0lPUyApIHtcbiAgICAgICAgICAgICAgICAvL3dlYlZpZXcuaW9zLnNjcm9sbFZpZXcuem9vbVNjYWxlID0gMTtcbiAgICAgICAgICAgICAgICAvL3dlYlZpZXcuaW9zLnNjYWxlc1BhZ2VUb0ZpdCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2ViVmlldy5zcmMgPSBcImh0dHA6Ly93d3cucGFyZW50cGF5c2hvcC5jb20vc2Nob29scy93c20vaW5kZXguaHRtXCI7XG59Il19