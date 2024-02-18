const BASE_URL = 'http://127.0.0.1:8000';

export const fetchItems = (list_id, setItems) =>
  fetch(`${BASE_URL}/lists/${list_id}/items`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to Fetch items');
      }
      return response.json();
    })
    .then(data => {
      setItems(data.data);
    })
    .catch(error => {
      console.error('Error fetching items:', error);
    });


export const createItem = (list_id, item, setItem, items, setItems) =>
  fetch(`${BASE_URL}/lists/${list_id}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: item.title,
      priority: item.priority,
      due_date: item.dueDate === '' ? null : item.dueDate,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to Create item');
      }
      return response.json();
    })
    .then(data => {
      setItems([...items, data.data]);
      setItem({ id: null, title: '', priority: 'none', dueDate: '' });
    })
    .catch(error => {
      console.error('Error creating item:', error);
    });


export const editItem = (list_id, theId, theTitle, thePriority, theDueDate, setItems) =>
  fetch(`${BASE_URL}/lists/${list_id}/items/${theId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: theTitle,
      priority: thePriority,
      due_date: theDueDate,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    })
    .then(data => {
      setItems(updatedItems => updatedItems.map(itm => {
        if (itm.id === data.data.id) {
          return {
            ...itm,
            title: data.data.title,
            priority: data.data.priority,
            due_date: data.data.due_date,
          };
        }
        return itm;
      }));

    })
    .catch(error => {
      console.error('Error updating item:', error);
    });


export const deleteItem = (list_id, id, items, setItems) =>
  fetch(`${BASE_URL}/lists/${list_id}/items/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      const updatedItems = items.filter(itm => itm.id !== id);
      setItems(updatedItems);
    })
    .catch(error => {
      console.error('Error deleting item:', error);
    });


export const toggleIsDone = (theId, setItems) =>
  fetch(`${BASE_URL}/items/${theId}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },

  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    })
    .then(data => {
      setItems(updatedItems => updatedItems.map(itm => {
        if (itm.id === data.data.id) {
          return {
            ...itm,
            is_done: data.data.is_done,
          };
        }
        return itm;
      }));

    })
    .catch(error => {
      console.error('Error updating item:', error);
    });


export const filterItems = (list_id, selectedPriority, selectedStatus, setItems) =>
// Send PUT request to update item
  fetch(`${BASE_URL}/lists/${list_id}/filter_items?priority=${selectedPriority.join(',')}&status=${selectedStatus}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    })
    .then(data => {
      setItems(data.data);
    })
    .catch(error => {
      console.error('Error updating item:', error);
    });
