## About
My project is a simple to-do list application. The front end is built using React, utilizing the template. The backend is developed with Python, employing FastAPI. The application includes the following features:

- Users can create multiple lists by specifying the list name. Each list can contain different items (tasks), with each item having a title, priority (high, medium, low, or none), and due date.
  
![image](https://github.com/othmane099/todo_app/assets/48645187/ee2329d8-659a-4ab0-ac6f-f9c57cd22ab3)

- Accessing the item list of a specific list is achieved by navigating to the list of lists and then clicking on the desired list's name.

![image](https://github.com/othmane099/todo_app/assets/48645187/f68f47ca-7842-47c2-8d70-94681f4a09e4)

- Items can be marked as done by checking their respective checkboxes.
- Filtering options are available within each list based on priority and item status (done or not yet).
  
![image](https://github.com/othmane099/todo_app/assets/48645187/fd655c9e-fa6f-4069-8adc-0a33b9036466)

- The project contains a dashboard with 4 KPIs:
  - Total number of items (both done and not yet done).
  - Number of items not done.
  - Number of items with a due date and not done.
  - Number of items with high priority and not done.
  
![image](https://github.com/othmane099/todo_app/assets/48645187/a497ae82-a8c9-45b5-b5b3-4e02e4d5e490)


I tried writing clean and understandable code throughout the project, ensuring readability. I'm looking forward to your feedback!

## Installation
Clone the project

```bash
git clone https://github.com/othmane099/todo_app.git
```

#### Backend
Set up virtual environment

```Bash
python3 -m venv .venv
source .venv/bin/activate
```
Install requirements

```Bash
pip install -r requirements.txt
```
Set up db_url in main.py


```Bash
register_tortoise(
    app,
    db_url='mysql://root:password@localhost/todo_db',
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)
```
Run the server


```Bash
python -m uvicorn main:app --reload
```

#### Frontend

**Recommended Node.js v18.x.**

Install Packages

```
yarn install
```
Start server
```
yarn dev
```

