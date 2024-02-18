from tortoise import Model, fields
from tortoise.fields import OnDelete


class List(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    items_count = fields.IntField(default=0, blank=True)

    def increment_items_count_by_one(self):
        self.items_count += 1

    def decrement_items_count_by_one(self):
        self.items_count -= 1

    def __str__(self):
        return self.name


class Item(Model):
    id = fields.IntField(pk=True)
    item_list = fields.ForeignKeyField("models.List", related_name='items', on_delete=OnDelete.RESTRICT)
    title = fields.CharField(max_length=255)
    is_done = fields.BooleanField(default=False)
    priority = fields.CharField(max_length=10, choices=["none", "low", "medium", "high"], default="none")
    due_date = fields.DateField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    def toggle_is_done(self):
        self.is_done = not self.is_done

    def __str__(self):
        return self.title
