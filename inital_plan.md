Create an application that lets the user observe and control their neutriant intake.
The application should be either mobile (IOS) or web with mobile first. 
The architecture should be microservice with one service for basic UI, one for he DB, one for graphs, one for data handling



The application should have at minimum the following features

Workouts:
- Record a workout
- Record a set
- Select from a list of excercies
- Add a custom excercie
- track progress

Diet:
- a way to input the food / drink, 
  - At either current time, or spcified time (warning if in the feature)
- add nutritional value for an item. 
- create an item from other items
  - should have a way to remove circular references
- manually add nutriants at a specific time. (advanced mode?)
- view the history of food intake
- reccomend food plan based on exisiting items, recipes and nutritional wants
- view the data as a spread sheet
  - export to excel and CSV
- Track weight changes
