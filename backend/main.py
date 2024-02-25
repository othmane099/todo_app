import tracemalloc

from fastapi import FastAPI, HTTPException, Query
from starlette.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

import services
import validators
from models import List, Item
from requests import ListRequest, ItemRequest

# Enable tracemalloc
tracemalloc.start()
app = FastAPI()

# Define the origins that are allowed to make requests
origins = [
    "http://localhost:3030",
]

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


# DASHBOARD
@app.get("/dashboard")
async def dashboard():
    dashboard_data = await services.get_dashboard_data()
    return {"data": dashboard_data}


# LISTS
@app.get("/lists")
async def get_lists():
    lists = await services.get_lists()
    return {"data": lists}


@app.post("/lists")
async def create_list(request: ListRequest):
    list_obj = await services.save_list(request)
    if list_obj:
        return {"message": "List created successfully", "data": list_obj}
    else:
        raise HTTPException(status_code=500, detail="Failed to create list")


@app.put("/lists/{list_id}")
async def update_list(list_id: int, request: ListRequest):
    list_obj = await services.update_list(list_id, request)
    return {"data": list_obj}


@app.delete("/lists/{list_id}")
async def delete_list(list_id: int):
    await services.delete_list(list_id)
    return {"message": "List deleted successfully"}


# ITEMS
@app.get("/lists/{list_id}/items")
async def get_list_items(list_id: int):
    items = await services.get_list_items(list_id)
    return {"data": items}


# Get a specific item
@app.get("/items/{item_id}")
async def get_list_item(item_id: int):
    item = await Item.filter(id=item_id).first()
    return {"data": item}


@app.post("/lists/{list_id}/items")
async def create_list_item(list_id: int, request: ItemRequest):
    item_obj = await services.create_item(list_id, request)
    if item_obj:
        return {"message": "Item created successfully", "data": item_obj}
    else:
        raise HTTPException(status_code=500, detail="Failed to create item")


@app.put("/lists/{list_id}/items/{item_id}")
async def update_list_item(list_id: int, item_id: int, request: ItemRequest):
    item_obj = await services.update_item(list_id, item_id, request)
    return {"message": "Item updated successfully", "data": item_obj}


@app.delete("/lists/{list_id}/items/{item_id}")
async def delete_list_item(list_id: int, item_id: int):
    await services.delete_item(list_id, item_id)
    return {"message": "Item deleted successfully"}


@app.patch("/items/{item_id}/toggle")
async def toggle_list_item_status(item_id: int):
    item_obj = await services.toggle_item_status(item_id)
    return {"message": "Item Status updated successfully", "data": item_obj}



@app.get("/lists/{list_id}/filter_items")
async def get_list_filtered_items(list_id: int, priority: list = Query(None), status: str = None):
    items = await services.get_filtered_items(list_id, priority, status)
    return {'data': items}


register_tortoise(
    app,
    db_url='mysql://root:password@localhost/todo_db',
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)
