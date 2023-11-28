# TDT4290_group7_2023

## Introduction
This Django project is designed to display the predicted material density of buildings in Trondheim, offering insights into urban planning and development. It's an interactive tool that visualizes data on a map interface, allowing for a detailed analysis of construction materials used across the city.

## Features
* Interactive map of Trondheim displaying predicted material density
* Address search for specific buildings
* Filter options for different building types and different material types
* Partial functionality for generating a draft of a waste report.
* A fast learning model that can be retrained with new data

## Installation guide
1. Clone the repository
2. install necessary backend requirements using requirements.txt
    * pip install -r requirements.txt
3. Install node.js
     * https://nodejs.org/en/download/
4. Migrate the database (Set up database tables)
    * `python manage.py migrate`
5. (optional) Create a superuser (admin user)
    * `python manage.py createsuperuser`

## How to run the project
1. Run the backend server from the TDT4290_group7_2023/mapsite directory
    * `cd mapsite`
    * `python manage.py runserver`
    * The server should now be running on localhost:8000

2. Run the frontend
    * `cd frontend`
    * `npm install`
    * `npm run dev`
    * The frontend should now be running on localhost:5173

## License

License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE.md) file for details. The GPLv3 is a public license that allows this software to be freely used, modified, and distributed. For more information about this license, visit [GNU's GPL-3.0 page](https://www.gnu.org/licenses/gpl-3.0.en.html).