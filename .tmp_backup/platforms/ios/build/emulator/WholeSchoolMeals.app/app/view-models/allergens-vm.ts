import { ObservableArray } from 'data/observable-array';
import { getString, setString } from "application-settings";
import { Config, Allergen } from '../shared/models';
import * as couchbase from "nativescript-couchbase";

export class AllergenList extends ObservableArray<Allergen> {
    constructor() {
        super();       
    }

    load() {
        return fetch(Config.apiUrl + "allergens.ashx")
            .then(handleErrors)
            .then(function(response) {
                return response.json();
            }).then(data => {
                // Process the list of schools
                data.forEach(allergen => {
                    this.handleData(allergen);
                });

                // Add to local db
                let database = new couchbase.Couchbase("wsm");
                let allergens = database.getDocument("allergens");
                if (!allergens) {
                    database.createDocument(data, "allergens");
                } else {
                    database.updateDocument("allergens", data);
                }
            }).catch(error => {
                this.checkDatabase(error);
            });
    }

    private handleData(allergen) {              
        // Has the user saved this allergen in their prefs?
        let inMyAllergens: boolean = false;
        if (this.myAllergens) {
            inMyAllergens = this.myAllergens.includes(allergen.AllergenID);
        }

        this.push({
            name: allergen.Allergen,
            id: allergen.AllergenID,
            selected: inMyAllergens
        });
    }

    private checkDatabase(error) {
        let database: couchbase.Couchbase = new couchbase.Couchbase("wsm");
        let allergens = database.getDocument("allergens");

        if (!allergens) {
            throw Error(error);
        } else {
            for (let i = 0; i < Object.keys(allergens).length; i++) {
                console.log(allergens[i]);
                this.handleData(allergens[i]);
            }
        }
    }

    clear () {
        while (this.length) {
            this.pop();
        }
    };

    get myAllergens() {       
        let strAllergens: string = getString(Config.appSettings_myAllergens);
        let arrAllergens: number[] = [];
        
        if (strAllergens) {
            strAllergens.split(',').forEach(item => arrAllergens.push(Number(item)));
        }

        return arrAllergens;
    }

    set myAllergens(allergens: number[]) {
        setString(Config.appSettings_myAllergens,allergens.toString())
    }
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}