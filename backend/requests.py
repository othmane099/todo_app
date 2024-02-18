from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PriorityEnum(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"


class ListRequest(BaseModel):
    name: str


class ItemRequest(BaseModel):
    title: str
    priority: PriorityEnum = "none"
    due_date: Optional[datetime] = None
