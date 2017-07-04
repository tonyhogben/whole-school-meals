import { Observable } from "data/observable";
import { Config, Dish, Ingredient, Allergen, Photo, DayMenu } from "../shared/models";
import { AllergenList } from '../view-models/allergens-vm';
import * as couchbase from "nativescript-couchbase";

var allergenList = new AllergenList;

export class Menu extends Observable implements DayMenu {
    menuDate: Date;
    calendarId: number;
    main1: Dish;
    main2: Dish;
    side1: Dish;
    side2: Dish;
    side3: Dish;
    side4: Dish;
    side5: Dish;
    dessert1: Dish;
    dessert2: Dish;
    dessert3: Dish;
    dessert4: Dish;

    constructor() {
        super();
    }
    
    load(date) {
        return fetch(Config.apiUrl + "menu.ashx?d=" + date)
            .then(handleErrors)
            .then(response => {
                return response.json();
            }).then(data => {
                this.handleData(data);

                // Add to local db
                let database = new couchbase.Couchbase("wsm");
                let menu = database.getDocument(date);
                if (!menu) {
                    database.createDocument(data, date);
                } else {
                    database.updateDocument(date, data);
                }
            })
            .catch(error => {
                this.checkDatabase(date, error);
            });
    }

    private checkDatabase(date: string, error) {       
        let database: couchbase.Couchbase = new couchbase.Couchbase("wsm");
        let menu: DayMenu = database.getDocument(date);
        if (!menu) {
            throw Error(error);
        } else {
            this.handleData(menu);
        }
    }

    private handleData(data) {
        if (data) {
            this.set("menuDate", data.MenuDate);
            this.set("calendarId", data.CalendarID);
            this.set("main1", this.makeDish(data.Main1, data.CalendarID, data.MenuDate, "no_image_broccoli.jpg"));
            this.set("main2", this.makeDish(data.Main2, data.CalendarID, data.MenuDate, "no_image_leek.jpg"));
            this.set("side1", this.makeDish(data.Side1, data.CalendarID, data.MenuDate, "no_image_carrot.jpg"));
            this.set("side2", this.makeDish(data.Side2, data.CalendarID, data.MenuDate, "no_image_pumpkin.jpg"));
            this.set("side3", this.makeDish(data.Side3, data.CalendarID, data.MenuDate, "no_image_broccoli.jpg"));
            this.set("side4", this.makeDish(data.Side4, data.CalendarID, data.MenuDate, "no_image_leek.jpg"));
            this.set("side5", this.makeDish(data.Side5, data.CalendarID, data.MenuDate, "no_image_carrot.jpg"));
            this.set("dessert1", this.makeDish(data.Dessert1, data.CalendarID, data.MenuDate, "no_image_strawberry.jpg"));
            this.set("dessert2", this.makeDish(data.Dessert2, data.CalendarID, data.MenuDate, "no_image_pumpkin.jpg"));
            this.set("dessert3", this.makeDish(data.Dessert3, data.CalendarID, data.MenuDate, "no_image_strawberry.jpg"));
            this.set("dessert4", this.makeDish(data.Dessert4, data.CalendarID, data.MenuDate, "no_image_pumpkin.jpg"));
        }
    }

    private makeDish(jsonObj, calendarId, menuDate, noImgPath: string): Dish {
        if (jsonObj) {                      
            // Setup dish object
            let dish: Dish = {
                id: jsonObj.DishID,
                calendarId: calendarId,
                menuDate: menuDate,
                name: jsonObj.Name,
                description: jsonObj.Description,
                description_html: `</style><div style="font-family: Arial, Helvetica, sans-serif;">${jsonObj.DescriptionHTML}</div>`,
                vegetarian: jsonObj.Vegetarian,
                ingredients: [],
                allergens: [],
                hasYourAllergens: false,
                yourAllergenCount: 0,
                yourAllergenMessage: "",
                hasGallery: false,
                photos: []
            };

            // Ingredients
            let ingredientStr: string[] = [];
            jsonObj.Ingredients.forEach(ingredient => {
                let ing: Ingredient = {
                    id: ingredient.IngredientID,
                    name: ingredient.Ingredient,
                    vegetarian: ingredient.Vegetarian,
                    measurementId: ingredient.MeasurementID,
                    heading: ingredient.Heading,
                    allergens: [],
                }

                let allergensStr: string[] = [];
                if (ingredient.Allergens) { 
                    ingredient.Allergens.forEach(allergen => {
                        if (!allergen.Deleted) {
                            ing.allergens.push({
                                id: allergen.AllergenID,
                                name: allergen.Allergen
                            });

                            allergensStr.push(allergen.Allergen);
                        }
                    });
                }

                if (!ingredient.Heading) {
                    if (allergensStr.length > 0) {
                        ingredientStr.push(ingredient.Ingredient + " (" + allergensStr.toString() + ")");
                    } else {
                        ingredientStr.push(ingredient.Ingredient);
                    }
                }
                
                dish.ingredients.push(ing);
            });
            dish.ingredientList = ingredientStr.join(', ');

            // Allergens
            let allergensStr: string[] = [];
            let yourAllergensStr: string[] = [];
            
            jsonObj.Allergens.forEach(allergen => {
                if (!allergen.Deleted) {
                    dish.allergens.push({
                        id: allergen.AllergenID,
                        name: allergen.Allergen
                    });

                    allergensStr.push(allergen.Allergen);

                    if (allergenList.myAllergens.includes(allergen.AllergenID)) {
                        yourAllergensStr.push(allergen.Allergen);
                    }
                }
            });

            dish.allergenList = allergensStr.join(', ');

            // Has your allergens?
            if (yourAllergensStr.length > 0) {
                dish.yourAllergens = yourAllergensStr.join(', ');
                dish.hasYourAllergens = true;
                dish.yourAllergenCount = yourAllergensStr.length;
                dish.yourAllergenMessage =  `${dish.name} contains ${dish.yourAllergenCount} of your allergens`
            }

            // Photos
            jsonObj.Photos.forEach((photo, index) => {
                if (index == 0) {
                    dish.photo = photo.URL;
                }
                dish.photos.push({
                    url: photo.URL,
                    caption: photo.Caption
                });
            });
            if (!dish.photo) {
                //dish.photo = "~/images/" + Config.noImagePaths[Math.floor(Math.random() * Config.noImagePaths.length)];
                dish.photo = "~/images/" + noImgPath;
            }
            if (dish.photos.length > 1) {
                dish.hasGallery = true;
            }

            // Return the dish
            return dish;
        } else {
            return {
                id: 0,
                calendarId: 0,
                menuDate: new Date(),
                name: '',
                description: '',
                description_html: '',
                vegetarian: false,
                hasYourAllergens: false,
                yourAllergenCount: 0,
                yourAllergenMessage: "",
                photo: ""
            };
        }
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}