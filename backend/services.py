from fastapi import HTTPException
from tortoise.expressions import Q

import utils
import validators
from models import Item, List
from requests import ListRequest, ItemRequest


# DASHBOARD
async def get_dashboard_data():
    return {
        'items_count': await Item.all().count(),
        'items_not_done_count': await Item.filter(is_done=False).count(),
        'items_high_priority_count': await Item.filter(priority='high', is_done=False).count(),
        'items_due_date_count': await Item.filter(due_date__not_isnull=True, is_done=False).count()
    }


# LISTS

async def check_list_existence(list_id: int):
    list_obj = await List.filter(id=list_id).first()
    if not list_obj:
        raise HTTPException(status_code=404, detail="List not found")
    return list_obj


async def check_item_existence(item_id: int):
    item_obj = await Item.filter(id=item_id).first()
    if not item_obj:
        raise HTTPException(status_code=404, detail="Item not found")
    return item_obj


async def get_lists():
    return await List.all()


async def save_list(list_req: ListRequest):
    validators.validate_list(list_req)
    list_obj = await List.create(name=list_req.name)
    return list_obj


async def update_list(list_id: int, list_req: ListRequest):
    list_obj = await check_list_existence(list_id)
    validators.validate_list(list_req)
    list_obj.name = list_req.name
    await list_obj.save()
    return list_obj


async def delete_list(list_id: int):
    list_obj = await check_list_existence(list_id)
    await list_obj.delete()


# ITEMS

async def get_list_items(list_id: int):
    await check_list_existence(list_id)
    return await Item.filter(item_list_id=list_id).order_by('-created_at')


async def create_item(list_id: int, item_req: ItemRequest):
    list_obj = await check_list_existence(list_id)
    validators.validate_item(item_req)
    item_obj = await Item.create(
        item_list_id=list_id,
        title=item_req.title,
        priority=item_req.priority,
        due_date=item_req.due_date
    )
    if item_obj:
        list_obj.increment_items_count_by_one()
        await list_obj.save()
    return item_obj


async def update_item(list_id: int, item_id: int, item_req: ItemRequest):
    await check_list_existence(list_id)
    item_obj = await check_item_existence(item_id)
    validators.validate_item(item_req)

    item_obj.title = item_req.title
    item_obj.priority = item_req.priority
    item_obj.due_date = item_req.due_date
    await item_obj.save()
    return item_obj


async def delete_item(list_id: int, item_id: int):
    list_obj = await check_list_existence(list_id)
    item_obj = await check_item_existence(item_id)
    await item_obj.delete()
    list_obj.decrement_items_count_by_one()
    await list_obj.save()


async def toggle_item_status(item_id: int):
    item_obj = await check_item_existence(item_id)
    item_obj.toggle_is_done()
    await item_obj.save()
    return item_obj


async def get_filtered_items(list_id: int, priority: list = None, status: str = None):
    await check_list_existence(list_id)
    is_done = utils.convert_status(status)
    if (is_done is not None) and not (priority == ['']):
        priority_list = utils.convert_priority_param_to_list(priority)
        items = await Item.filter(
            Q(item_list_id=list_id) & Q(is_done=is_done) & Q(priority__in=priority_list)).all().order_by('-created_at')
    elif is_done is not None:
        items = await Item.filter(Q(item_list_id=list_id) & Q(is_done=is_done)).all().order_by('-created_at')
    elif not priority == ['']:
        priority_list = utils.convert_priority_param_to_list(priority)
        items = await Item.filter(Q(item_list_id=list_id) & Q(priority__in=priority_list)).all().order_by('-created_at')
    else:
        items = await Item.filter(item_list_id=list_id).all().order_by('-created_at')

    return items
