import { Page } from "ui/page";
import { EventData } from "data/observable";
import { Config, Dish } from '../../shared/models';
import { isIOS, device } from "tns-core-modules/platform";
import { topmost, goBack } from "ui/frame";
import { Image } from "ui/image";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { setTimeout } from "timer";
import { GridLayout } from "ui/layouts/grid-layout";
import * as moment from "moment";

var dish: Dish,
    page: Page;


export function onLoaded(args: EventData) {
    page = <Page>args.object;
    dish = page.navigationContext;
    page.bindingContext=dish;

    // get the menu date and see if we should show the feedback panel
    let feedbackPanel: GridLayout = <GridLayout>(page.getViewById("feedbackPanel"));

    if (moment(dish.menuDate).isSame(moment(), 'day')) {
        if (moment(moment()).isAfter(moment('13:00', 'hh:mm'))) {
            // They have had lunch - show
            feedbackPanel.visibility = "visible";
        } else {
            // They have not had lunch yet - hide
            feedbackPanel.visibility = "collapse";
        }
    } else if (moment(dish.menuDate).isBefore(moment())) {
        // In the past - show
        feedbackPanel.visibility = "visible";
    } else {
        // In the future - hide
        feedbackPanel.visibility = "collapse";
    }
}

export function back() {
    goBack();
}

export function showImage(args) {
    let tappedView = args.view,
        tappedItem = tappedView.bindingContext,
        mainPhoto: Image = <Image>(page.getViewById("mainPhoto"));
    
    mainPhoto.src = tappedItem.url;
}

export function fbYes() {
    sendFeedback(true);
}

export function fbNo() {
    sendFeedback(false);
}

function sendFeedback(Feedback: boolean) {
    // Get the buttons by ID and set their isUserInteractionEnabled="false" so they cannot be double clicked
    let feedbackLabel: Label = <Label>(page.getViewById("feedbackLabel")),
        feedbackBtnYes: Button = <Button>(page.getViewById("feedbackBtnYes")),
        feedbackBtnNo: Button = <Button>(page.getViewById("feedbackBtnNo"));

    feedbackBtnYes.isUserInteractionEnabled=false;
    feedbackBtnNo.isUserInteractionEnabled=false;
    
    feedbackBtnYes.className="fa loading";
    feedbackBtnNo.className="fa loading";

    // Change label to read "Sending your feedback" and add an activity indicator
    feedbackLabel.text="Sending your feedback";

    // Once complete, hide the buttons (and the bottom label) and change the main label to read "Thank you, your feedback has been sent"
    const id = setTimeout(() => {
        fetch(Config.apiUrl + "feedback.ashx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    DishID: dish.id, 
                    CalendarID: dish.calendarId,
                    Feedback: Feedback ? 1 : 0,
                    IPAddress: '',
                    UserAgent: device.model + ', ' + device.deviceType + ', ' + device.os + ', ' + device.osVersion + ', ' + device.sdkVersion,
                    DeviceID: device.uuid
                })
            }).then(handleErrors)
            .then(function(response) {
                //console.dir(response);
                return response.json();
            }).then(response => {
                const id = setTimeout(() => {
                    feedbackLabel.text="Thank you, your feedback has been sent";

                    const id = setTimeout(() => {
                        // Re-enable the buttons and change the message again
                        feedbackLabel.text="Did another child enjoy this dish?";
                        
                        feedbackBtnYes.isUserInteractionEnabled=true;
                        feedbackBtnNo.isUserInteractionEnabled=true;

                        feedbackBtnYes.className="fa";
                        feedbackBtnNo.className="fa";
                    }, 1500);
                }, 1000);
            }).catch(function() {
                feedbackLabel.text="Did your child enjoy this dish?";
                
                feedbackBtnYes.isUserInteractionEnabled=true;
                feedbackBtnNo.isUserInteractionEnabled=true;

                feedbackBtnYes.className="fa";
                feedbackBtnNo.className="fa";

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