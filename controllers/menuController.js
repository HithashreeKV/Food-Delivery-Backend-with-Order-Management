const { menu } = require("../utils/data");

const addMenuItem = (req, res) => {
    const { name, price, category } = req.body;

    // Validation
    if (!name || price <= 0 || !["Starter", "Main Course", "Dessert"].includes(category)) {
        return res.status(400).json({ message: "Invalid menu item details" });
    }

    // Add or Update Menu
    const existingItem = menu.find(item => item.name === name);
    if (existingItem) {
        Object.assign(existingItem, { price, category });
        return res.json({ message: "Menu item updated", item: existingItem });
    }

    const newItem = { id: menu.length + 1, name, price, category };
    menu.push(newItem);
    res.status(201).json({ message: "Menu item added", item: newItem });
};

const getMenu = (req, res) => {
    res.json({ menu });
};

module.exports = { addMenuItem, getMenu };
