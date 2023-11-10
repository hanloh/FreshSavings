# IS216-G7T2
# Freshsavings
Freshsavings is an all-in-one platform to reduce wastage of expired food in Singapore. Over the past 10 years, food waste is becoming one of the biggest waste streams and the amount generated has since grown by 20%! 

We aim to tackle the problem through a three-pronged approach:  
- Inventory Tracker: Keeps track of inventory at home and reminds users food produces that are soon to expire.
- Recipe Generator: Recommends food recipes based on the user's list of items in Inventory Tracker. 
- Marketplace: Selling or purchasing food produces that are soon to expire at highly discounted prices. 

## Requirements
- Node 16.15.0

## Tools used
- [Vue 3](https://vuejs.org/guide/introduction.html)
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

## Beyond The Lab
- [Github](https://github.com/)
- [Amazon RDS](https://aws.amazon.com/rds/)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [LottieFiles](https://lottiefiles.com/)
- [Vueuse](https://vueuse.org/)
- [Vue Router](https://router.vuejs.org/)

# Description

## Vue
We used `VUE3 cli` for this project. This allowed us to customize configuration. [Configuration Reference](https://cli.vuejs.org/config/).

Most notable portions included the use of 
- VUE Routers

We created `components` that were reused in various places and imported them where needed to streamline the application. Such components include NavBar and Footer. 

## Bootstrap & CSS
We made use of the `12-point grid system` to help make our application responsive. We utilised Bootstrap features like `modal`, `accordian panel` and we styled our webite using CSS and icons. We took ideas for our marketplace design from exisiting HTML templates such as [this](https://startbootstrap.com/template/shop-homepage).

# API used
We incoporated [GoogleMaps API](https://developers.google.com/maps) into the project.

This API can be found in our Checkout page under the accordian panel titled 'Display Locations on  Maps'. The map generated serves as a visual indication of the distance between the buyer and the seller, and allows the buyer to decide on a self pickup or delivery option! 

# Beyond the Lab

## Github
We created a `repo` and used it for version control and collaboration. 

## Pinia and localStorage
We used `VUE's` offical state management library `Pinia` for global state management across our application. We also incorporated browser's `localStorage` where appropriate.

This allowed us to persist information when routing through different views and through refresh.

## AWS RDS and MySQL
We used `Amazons RDS` as a managed relational database service for the `MySQL` server. It allowed us to operate and scale the database on cloud. 

## Animation Libraries
We used `Lottiefiles` to incorporate lightweight SVG animation files.

# Project setup
### Access project folder and and download dependencies

```sh
cd freshsavings
npm install
```


### Compiles and hot-reloads for development
```sh
npm run serve
```

### Compiles and minifies for production
```sh
npm run build
```

### Download dotenv file into the freshsavings directory
```sh
npm install dotenv
```

### Start a Node.js server
```sh
node server.js 
```

# Accessing application

## Log in with these credentials
You may log into our pages using any of the following credentials.
```sh
credentials_list = [
    ("john@gmail.com", "password1"),
    ("jane@gmail.com", "password2"),
    ("michael@gmail.com", "password3"),
    ("emily@gmail.com", "password4"),
]
```

## Inventory Tracker
To create a new item, you need to access the 'new item' button. 
A modal pop ups and you can enter the name of any food items found in the list below. 

```sh
food_list = [
    "Apple",
    "Banana",
    "Beef",
    "Blueberries",
    "Butter",
    "Cheese",
    "Chicken",
    "Cod",
    "Cottage Cheese",
    "Crab",
    "Cream",
    "Duck",
    "Eggs",
    "Grapes",
    "Kiwi",
    "Lamb",
    "Lobster",
    "Milk",
    "Mozzarella",
    "Orange",
    "Pineapple",
    "Pork",
    "Salmon",
    "Sardines",
    "Shrimp",
    "Strawberries",
    "Trout",
    "Tuna",
    "Turkey",
    "Yogurt"
]
```


