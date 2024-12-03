const orderStatus = ["Preparing", "Out for Delivery", "Delivered"];

const updateOrderStatus = (orders) => {
    orders.forEach(order => {
        if (order.status !== "Delivered") {
            const currentIndex = orderStatus.indexOf(order.status);
            order.status = orderStatus[Math.min(currentIndex + 1, orderStatus.length - 1)];
        }
    });
};

module.exports = { updateOrderStatus };
