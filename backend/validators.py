from fastapi import HTTPException

from requests import ListRequest, ItemRequest


def validate_list(request: ListRequest):
    if not request.name.strip():
        error_detail = "List's name is required"
        raise HTTPException(status_code=422, detail=error_detail)


def validate_item(request: ItemRequest):
    if not request.title.strip():
        error_detail = "Item's title is required"
        raise HTTPException(status_code=422, detail=error_detail)
