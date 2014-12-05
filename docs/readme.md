# Docs Deployment.

Documents are generated using a python static generator emulating the django templating libary.

## Layout

+ **development**: contains the working files to generate the documentation and site mocks
+ **deploy**: contains the static site generated from the 'developement' folder
+ **env**: contains the python environment for the static state generations. This should be deleted in production
+ **hyde**: The static site generator tool, creating static sites deployed to '**deploy**' from reference of 'development'
+ **site-mockup**: lagecy data created prior to the static ste generator. All information over time will be applied to the development folder. Thusly this folder should be rendunant after full reimplementation.

# API

/api/locations/
/api/bookings/
/api/bookings/{id}
/api/bookings/{id}/customers
