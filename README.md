# TDT4290_group7_2023

## Installation guide
1. Clone the repository
2. Install django, corsheaders, and django rest framework
    * `pip install django`
    * `pip install django-cors-headers`
    * `pip install djangorestframework`
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
    * `npm run dev`
    * The frontend should now be running on localhost:5173