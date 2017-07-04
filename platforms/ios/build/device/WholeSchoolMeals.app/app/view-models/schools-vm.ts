import { ObservableArray } from 'data/observable-array';
import { getString, setString, setBoolean } from "application-settings";
import { Config, School } from '../shared/models';
import * as couchbase from "nativescript-couchbase";
import { subscribeToTopic, unsubscribeFromTopic } from "nativescript-plugin-firebase";

export class SchoolList extends ObservableArray<School> {
    constructor() {
        super();       
    }

    load(updateSubscriptions: boolean = false) {
        return fetch(Config.apiUrl + "schools.ashx")
            .then(handleErrors)
            .then(function(response) {
                return response.json();
            }).then(data => {               
                // Process the list of schools
                data.forEach(school => {
                    this.handleData(school, updateSubscriptions);
                });

                // Add to local db
                let database = new couchbase.Couchbase("wsm");
                let schools = database.getDocument("schools");
                if (!schools) {
                    database.createDocument(data, "schools");
                } else {
                    database.updateDocument("schools", data);
                }
            }).then(function() {
                // Always set this as this would have happened by now and if this is a first run, it's nice to be declaritive ;)
                setBoolean("updateNotificationTopics", false)
            }).catch(error => {
                this.checkDatabase(error);
            });
    }

    updateSubscriptions() {
        this.load(true);
    }

    private handleData(school, updateSubscriptions?: boolean) {              
        // Has the user saved this school in their prefs?
        let inMySchools: boolean = false;
        if (this.mySchools) {
            inMySchools = this.mySchools.includes(school.SchoolID);
        }

        this.push({
            name: school.Name,
            town: school.Town,
            id: school.SchoolID,
            selected: inMySchools
        });

        if (updateSubscriptions) {
            let topicID: string = "school" + school.SchoolID;
            if (inMySchools) {
                // Subscribe to the 'topic' for notifications
                //console.log("subscribeToTopic: " + topicID);
                subscribeToTopic(topicID);
            } else {
                //console.log("unsubscribeFromTopic: " + topicID);
                unsubscribeFromTopic(topicID);
            }
        }
    }

    private checkDatabase(error) {       
        let database: couchbase.Couchbase = new couchbase.Couchbase("wsm");
        let schools = database.getDocument("schools");

        if (!schools) {
            throw Error(error);
        } else {
            for (let i = 0; i < Object.keys(schools).length; i++) {
                this.handleData(schools[i]);
            }
        }
    }

    clear () {
        while (this.length) {
            this.pop();
        }
    }

    get mySchools() {       
        let strSchools: string = getString(Config.appSettings_mySchools);
        let arrSchools: number[] = [];
        
        if (strSchools) {
            strSchools.split(',').forEach(item => arrSchools.push(Number(item)));
        }

        return arrSchools;
    }

    set mySchools(schools: number[]) {
        setString(Config.appSettings_mySchools,schools.toString())
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}