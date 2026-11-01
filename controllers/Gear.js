const postgres = require("../app-data-source");
const { IsNull } = require("typeorm");
const { today } = require("../utils/dates");

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

async function show(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(404).send("Gear not found");
    }

    const gearRepo = postgres.getRepository("Gear");
    const checkoutRepo = postgres.getRepository("Checkout");

    const gear = await gearRepo.findOne({ where: { id } });

    if (!gear) {
        return res.status(404).send("Gear not found");
    }

    const history = await checkoutRepo.find({
        where: { gear: { id } },
        relations: { gear: true, member: true },
        order: { checkedOutOn: "DESC" }
    });

    const isAvailable = !history.some(function(checkout) {
        return checkout.returnedOn === null;
    });

    res.render("Gear/show",
        { title: gear.name,
            gear,
            history,
            isAvailable,
            today: today()
        });
}

module.exports = { index, show };