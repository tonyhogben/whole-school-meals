//export class School {
  //constructor(
    //id: number,
    //name: string,
    //town: string,
    //favourite?: boolean
  //) {}
//}

export class Config {
    static readonly apiUrl = "http://app.wholeschoolmeals.co.uk/api/";
    static readonly appSettings_mySchools = "my-schools";
    static readonly appSettings_myAllergens = "my-allergens";
    static readonly noImagePaths = [
        "no_image_broccoli.jpg",
        "no_image_leek.jpg",
        "no_image_carrot.jpg",
        "no_image_strawberry.jpg",
        "no_image_pumpkin.jpg"
    ];
}

export interface School {
    id: number,
    name: string,
    town: string,
    selected?: boolean
}

export interface Allergen {
    id: number,
    name: string,
    selected?: boolean
}

export interface Ingredient {
    id: number,
    name: string,
    vegetarian: boolean,
    measurementId: number,
    heading: boolean,
    allergens: Allergen[]
}

export interface Photo {
    url: string,
    caption: string
}

export interface Dish {
    id: number,
    calendarId: number,
    menuDate: Date,
    name: string,
    description: string,
    description_html: string,
    vegetarian: boolean,
    allergens?: Allergen[],
    allergenList?: string,
    hasYourAllergens: boolean,
    yourAllergens?: string,
    yourAllergenCount?: number,
    yourAllergenMessage?: string;
    ingredients?: Ingredient[],
    ingredientList?: string,
    photo?: string,
    hasGallery?: boolean,
    photos?: Photo[]
}

export interface DayMenu {
    menuDate: Date,
    calendarId: number,
    main1: Dish,
    main2: Dish,
    side1: Dish,
    side2: Dish,
    side3: Dish,
    side4: Dish,
    side5: Dish,
    dessert1: Dish,
    dessert2: Dish,
    dessert3: Dish,
    dessert4: Dish
}