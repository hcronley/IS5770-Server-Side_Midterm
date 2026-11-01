const postgres = require("../app-data-source");
const { IsNull } = require("typeorm");
const { today } = require("../utils/dates");
const { parseId } = require("../utils/ids");


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
    const id = parseId(req.params.id);

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

async function newForm(req, res) {
    res.render("Gear/form", {
        title: "Add Gear",
        gear: null,
        action: "/gear"
    });
}

async function create(req, res) {
    const gearRepo = postgres.getRepository("Gear");

    const saved = await gearRepo.save({
        name: req.body.name,
        category: req.body.category,
        condition: req.body.condition,
        dailyFee: Number(req.body.dailyFee),
        description: req.body.description
    });

    res.redirect("/gear/" + saved.id);
}

async function editForm(req, res) {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).send("Gear not found");

    const gearRepo = postgres.getRepository("Gear");
    const gear = await gearRepo.findOne({ where: { id } });
    if (!gear) return res.status(404).send("Gear not found");

    res.render("Gear/form", {
        title: "Edit " + gear.name,
        gear,
        action: "/gear/" + gear.id + "/edit"
    });
}

async function update(req, res) {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).send("Gear not found");

    const gearRepo = postgres.getRepository("Gear");
    const gear = await gearRepo.findOne({ where: { id } });

    if (!gear) return res.status(404).send("Gear not found");

    gear.name = req.body.name;
    gear.category = req.body.category;
    gear.condition = req.body.condition;
    gear.description = req.body.description;
    gear.dailyFee = Number(req.body.dailyFee);

    await gearRepo.save(gear);

    res.redirect("/gear/" + gear.id);
}

module.exports = { index, show, parseId, newForm, create, editForm, update };