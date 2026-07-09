/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: index.js
 * Description: API to create an inventory item.
 */

// POST request to add a new item to the inventory
router.post('/', async (req, res) => {
    try {
        const valid = validateAddItem(req.body);

        if (!valid) {
            return next(createError(400, ajv.errorsText(validateAddItem.errors)));
    }

    const payload = {
        ...req.body,
        itemId: req.params.itemId
    }

    const item = new Item(payload);
    await item.save();

    res.send({
        message: 'Item added to inventory successfully',
        id: item._id
    });
    } catch (err) {
        console.error(`Error while creating item: ${err}`);
        next(err);
}
});



