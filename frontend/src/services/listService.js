const BASE_URL = 'http://127.0.0.1:8000';


export const fetchLists = (setLists) =>
  fetch(`${BASE_URL}/lists`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to Fetch lists');
      }
      return response.json();
    })
    .then(data => {
      setLists(data.data);
    })
    .catch(error => {
      console.error('Error fetching lists:', error);
    });


export const createList = (listName, setListName, lists, setLists) =>
  fetch(`${BASE_URL}/lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: listName }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to Create list');
      }
      return response.json();
    })
    .then(data => {
      setLists([...lists, data.data]);
      setListName('');
    })
    .catch(error => {
      console.error('Error creating list:', error);
    });


export const editList = (id, name, setLists) =>
  fetch(`${BASE_URL}/lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update list');
      }
      return response.json();
    })
    .then(data => {
      setLists(updatedLists => updatedLists.map(list => {
        if (list.id === data.data.id) {
          return { ...list, name: data.data.name }; // Update the name of the updated item
        }
        return list;
      }));
    })
    .catch(error => {
      console.error('Error updating list:', error);
    });


export const deleteList = (id, lists, setLists) =>
  fetch(`${BASE_URL}/lists/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      // Filter out the deleted item from the state
      const updatedLists = lists.filter(item => item.id !== id);
      setLists(updatedLists);
    })
    .catch(error => {
      console.error('Error deleting item:', error);
    });

