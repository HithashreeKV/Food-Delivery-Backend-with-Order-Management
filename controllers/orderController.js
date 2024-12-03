const { menu, orders } = require("../utils/data");
const { v4: uuidv4 } = require("uuid");

const placeOrder = (req, res) => {
    const { items } = req.body;

    // Validate item IDs
    if (!Array.isArray(items) || items.some(id => !menu.find(item => item.id === id))) {
        return res.status(400).json({ message: "Invalid menu items in order" });
    }

    const newOrder = {
        id: uuidv4(),
        items,
        status: "Preparing",
        createdAt: new Date(),
    };

    orders.push(newOrder);
    res.status(201).json({ message: "Order placed", order: newOrder });
};

const getOrder = (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
};

module.exports = { placeOrder, getOrder };
