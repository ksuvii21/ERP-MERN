const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');

// @desc Create PO
// @route POST /api/supply-chain/po
const createPO = async (req, res) => {
    try {
        const { supplierId, items, totalAmount, expectedDelivery } = req.body;
        const poNumber = 'PO-' + Date.now();
        
        const po = await PurchaseOrder.create({
            poNumber,
            supplier: supplierId,
            items,
            totalAmount,
            expectedDelivery,
            createdBy: req.user._id,
            status: 'Ordered',
            timeline: [{ status: 'Ordered', note: 'Order placed successfully' }]
        });
        
        res.status(201).json(po);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update PO Status (Dispatch/Track)
// @route PUT /api/supply-chain/po/:id/status
const updatePOStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note, trackingNumber } = req.body;
        
        const po = await PurchaseOrder.findById(id);
        if (!po) return res.status(404).json({ message: 'PO not found' });
        
        po.status = status;
        if (trackingNumber) po.trackingNumber = trackingNumber;
        po.timeline.push({ status, note });
        
        await po.save();
        res.json(po);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPO, updatePOStatus };