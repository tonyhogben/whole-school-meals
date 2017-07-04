import { Page } from "ui/page";
import { GridLayout } from "ui/layouts/grid-layout";
import { StackLayout } from "ui/layouts/stack-layout";
import { Observable, EventData, fromObject, PropertyChangeData } from "data/observable";
import { topmost } from "ui/frame";
import * as moment from "moment";
import * as TimeDatePicker from "nativescript-timedatepicker";
import { Menu } from "../../../view-models/menu-vm";
import { GestureTypes, SwipeGestureEventData, SwipeDirection } from "ui/gestures";

var view: GridLayout,
    menu: Menu = new Menu,
    viewData: Observable = fromObject({
        date: new Date(),
        displayDate: "Today",
        menu: menu,
        isLoading: true,
        menuError: ""
    });

export function onViewLoaded(args: EventData) {
    view = <GridLayout>args.object;
    view.bindingContext=viewData;

    // Set the start date - make sure it is not the weekend, if so, go to Monday
    if (!viewData.get("date")) {
        updateDay(new Date());
    } else {
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

export function pickDay(args) {
    //Create a callback function
    let callback =  ((date) => {
        if (date) {
            let newDate = moment(date, "DD MM YYYY hh:mm").toDate();;
            updateDay(newDate);
        }
    });

    //Initialize the PickerManager (.init(yourCallback, title, initialDate))
    TimeDatePicker.init(callback,null,viewData.get("date"));

    //Show the dialog
    TimeDatePicker.showDatePickerDialog();
}

export function prevDay() {
    let theDay = viewData.get("date");
    theDay.setDate(theDay.getDate() - 1);

    if (moment(theDay).weekday() == 0) {
        theDay.setDate(theDay.getDate() - 2);
    }

    updateDay(theDay);
}

export function nextDay() {
    let theDay = viewData.get("date");
    theDay.setDate(theDay.getDate() + 1);

    if (moment(theDay).weekday() == 6) {
        theDay.setDate(theDay.getDate() + 2);
    }

    updateDay(theDay);
}

function updateDay(date) {
    let menuWrap: StackLayout = <StackLayout>view.getViewById("menuWrap");
    menuWrap.animate({
        opacity: 0,
        duration: 200
    });

    viewData.set("isLoading", true);

    if (moment(date).weekday() == 6) {
        //Saturday
        date.setDate(date.getDate() + 2);
    } else if (moment(date).weekday() == 0) {
        //Sunday
        date.setDate(date.getDate() + 1);
    }
    viewData.set("date", date);
    viewData.set("displayDate", displayDate(date));

    // Load menu for selected day
    menu.load(moment(date).format("DD/MM/YYYY"))
        .then(function() { 
            viewData.set("menuError", "");
            viewData.set("isLoading", false);

            menuWrap.animate({
                opacity: 1,
                duration: 500
            });
        }).catch(error => {
            let strError: string;
            if (error.toString().includes("555")) {
                strError = "There is no menu information available for this day yet, please try again later.";
            } else if (error.toString().includes("offline")) {
                strError = "You do not appear to have an Internet Connection, please try again when you are connected.";
            } else {
                strError = "We appear to be having trouble getting the menu information for this day at the moment, please try again later.";
            }

            viewData.set("menuError", strError);
            viewData.set("isLoading", false);
        });
}

function displayDate(date) {
    return (moment(date).calendar(null, {sameElse: 'DD/MM/YYYY'}).split(" at"))[0];
}

export function goMain1() {
    goToDish(menu.main1);
}

export function goMain2() {
    goToDish(menu.main2);
}

export function goSide1() {
    goToDish(menu.side1);
}

export function goSide2() {
    goToDish(menu.side2);
}

export function goSide3() {
    goToDish(menu.side3);
}

export function goSide4() {
    goToDish(menu.side4);
}

export function goSide5() {
    goToDish(menu.side5);
}

export function goDessert1() {
    goToDish(menu.dessert1);
}

export function goDessert2() {
    goToDish(menu.dessert2);
}

export function goDessert3() {
    goToDish(menu.dessert3);
}

export function goDessert4() {
    goToDish(menu.dessert4);
}

function goToDish(Dish) {
    topmost().navigate({
        moduleName: "views/dish/dish",
        context: Dish
    });
}