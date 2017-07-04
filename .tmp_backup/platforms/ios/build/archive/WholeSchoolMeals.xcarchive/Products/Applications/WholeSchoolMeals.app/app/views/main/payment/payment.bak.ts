import { Page } from "ui/page";
import { EventData, fromObject, Observable } from "data/observable";
import { WebView, LoadEventData } from "ui/web-view";
import { topmost } from "ui/frame";
import { GridLayout } from "ui/layouts/grid-layout";
import { StackLayout } from "ui/layouts/stack-layout";
import { isIOS, isAndroid, screen } from "tns-core-modules/platform";
import { setTimeout } from "timer";

var viewData: Observable = fromObject({
    paymentPageLoading: true
});

export function onViewLoaded(args: EventData) {
    const view: GridLayout = <GridLayout>args.object;
    view.bindingContext = viewData;

    viewData.set("paymentPageLoading", true);

    let webView: WebView = <WebView>view.getViewById("paymentPage");

    webView.on(WebView.loadFinishedEvent, function (args: LoadEventData) {
        if (args.error) {
            webView.src = "<html><style>* { font-family: Arial, Helvetica, sans-serif; }</style><body>You must have an Internet connection to make a payment</body></html>"
        } else {
            viewData.set("paymentPageLoading", false);

            //console.log("WebView Width: " + webView.width);
            //console.log("WebView getMeasuredWidth: " + webView.getMeasuredWidth());
            //console.log("WebView effectiveWidth: " + webView.effectiveWidth);
            //console.log("Screen width: " + screen.mainScreen.widthPixels);
            //console.log("Screen scale: " + screen.mainScreen.scale);

            if ( isAndroid ) {
                let pageWidth: number = 800 + 20, // width of page plus some padding
                    screenWidth: number = screen.mainScreen.widthPixels;

                let scale: number = (screenWidth / pageWidth) * 100;

                webView.android.setInitialScale(scale);
            }

            if ( isIOS ) {
                //webView.ios.scrollView.zoomScale = 1;
                //webView.ios.scalesPageToFit = true;
            }

        }
    });

    webView.src = "http://www.parentpayshop.com/schools/wsm/index.htm";
}