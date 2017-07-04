import { StackLayout } from "ui/layouts/stack-layout";
import { Observable, EventData, fromObject, PropertyChangeData } from "data/observable";
import { Config } from '../../../shared/models';
import { validate } from "email-validator";

var viewData: Observable = fromObject({
    name: "",
    phone: "",
    email: "",
    message: "",
    isLoading: false
});

export function onViewLoaded(args: EventData) {
    const view = <StackLayout>args.object;
    view.bindingContext=viewData;
}

export function sendMessage() {   
    if (!viewData.get("message")) {
        alert("You need to enter a message!");
        return;
    }

    if (viewData.get("email")) {
        if (!validate(viewData.get("email"))) {
            alert("Please check you have entered a valid email address!");
            return;
        }
    }

    viewData.set("isLoading", true);

    fetch(Config.apiUrl + "contact.ashx", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                Name: viewData.get("name") ? viewData.get("name") : '', 
                Phone: viewData.get("phone") ? viewData.get("phone") : '',
                Email: viewData.get("email") ? viewData.get("email") : '',
                Message: viewData.get("message")
            })
        }).then(handleErrors)
        .then(function(response) {
            return response.json();
        }).then(response => {
            viewData.set("name", "");
            viewData.set("phone", "");
            viewData.set("email", "");
            viewData.set("message", "");
            viewData.set("isLoading", false);

            alert("Thank you. Your message has been sent.");
        }).catch(function() {
            viewData.set("isLoading", false);
            alert("Something has gone wrong. Please make sure you have an internet connection and try again.");
        });
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}