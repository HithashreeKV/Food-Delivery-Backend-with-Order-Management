const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');


const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.json());


const menu = [];
const orders = [];
let orderId = 1;


cron.schedule('* * * * *', () => { // Runs every minute
  orders.forEach((order) => {
    if (order.status === 'Preparing') {
      order.status = 'Out for Delivery'; // Update status to "Out for Delivery"
      console.log(`Order ${order.id} status updated to: Out for Delivery`);
    } else if (order.status === 'Out for Delivery') {
      order.status = 'Delivered'; // Final status update
      console.log(`Order ${order.id} status updated to: Delivered`);
    }
  });
});

// Add Menu Item
app.post('/menu', (req, res) => {
  const { name, price, category } = req.body;

  // Validation for menu item
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'All fields (name, price, category) are required.' });
  }
  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number.' });
  }

  // Add menu item
  const newItem = { id: menu.length + 1, name, price, category };
  menu.push(newItem);
  res.status(201).json({ message: 'Menu item added successfully.', menuItem: newItem });
});

// Get Menu
app.get('/menu', (req, res) => {
  res.status(200).json(menu);
});

// Update Menu Item
app.put('/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, category } = req.body;

  // Find the menu item by ID
  const menuItem = menu.find((item) => item.id === id);
  if (!menuItem) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }

  // Update menu item
  if (name) menuItem.name = name;
  if (price) menuItem.price = price;
  if (category) menuItem.category = category;

  res.json({ message: `Menu item with ID ${id} updated successfully.`, updatedMenuItem: menuItem });
});

// Delete Menu Item
app.delete('/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = menu.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Menu item not found.' });
  }

  menu.splice(index, 1); // Delete the menu item
  res.json({ message: `Menu item with ID ${id} deleted successfully.` });
});

// Place Order
app.post('/orders', (req, res) => {
  const { items } = req.body;

  // Validate order items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item.' });
  }

  // Check if all items in the order exist in the menu
  const validItems = items.every(itemId => menu.some(menuItem => menuItem.id === itemId));
  if (!validItems) {
    return res.status(400).json({ error: 'Some items in the order do not exist in the menu.' });
  }

  // Create new order
  const newOrder = {
    id: orderId++,
    items,
    status: 'Preparing',  // Initial order status
  };
  orders.push(newOrder);

  // Respond with the created order
  res.status(201).json(newOrder);
});

// Get Order by ID
app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.status(200).json(order);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

