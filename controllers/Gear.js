const postgres = require("../app-data-source");
const { IsNull } = require("typeorm");

async function index(req, res) {
    const gearRepo = postgres.getRepository("Gear");
    const checkoutRepo = postgres.getRepository("Checkout");

    const currentCategory = req.query.category || "";

    const where = {};

    if (currentCategory) where.category = currentCategory;

    const gearItems = await gearRepo.find({ where, order: { name: "ASC" } });

    const allGear = await gearRepo.find({ select: { category: true } });
    const categories = Array.from(new Set(allGear.map((g) => g.category))).sort();

    const openCheckouts = await checkoutRepo.find({
        where: { returnedOn: IsNull() },
        relations: { gear: true }
    });

    const checkedOutIds = new Set(
        openCheckouts.map(function (checkout) {
        return checkout.gear.id;
    }));
    
    res.render("Gear/index",
        { title: "Gear Catalog",
            categories,
            currentCategory,
            gearItems,
            checkedOutIds
        });
}

module.exports = { index };