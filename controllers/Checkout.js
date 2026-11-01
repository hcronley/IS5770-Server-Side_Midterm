const postgres = require("../app-data-source");
const { IsNull, Not } = require("typeorm");
const { today } = require("../utils/dates");
const { parseId } = require("../utils/ids");

async function index(req, res) {
    const checkoutRepo = postgres.getRepository("Checkout");

    const openList = await checkoutRepo.find({
        where: { returnedOn: IsNull() },
        relations: { gear: true, member: true },
        order: { dueOn: "ASC" }
    });

    const returnedList = await checkoutRepo.find({
        where: { returnedOn: Not(IsNull()) },
        relations: { gear: true, member: true },
        order: { returnedOn: "DESC" },
        take: 5
    });

    res.render("Checkout/index", { title: "Checkouts", openList, returnedList, today: today() });
}

async function loadFormData() {
    const gearRepo = postgres.getRepository("Gear");
    const memberRepo = postgres.getRepository("Member");
    const checkoutRepo = postgres.getRepository("Checkout");

    const allGear = await gearRepo.find({ order: { name: "ASC" } });
    const members = await memberRepo.find({ order: { lastName: "ASC" } });

    const openCheckouts = await checkoutRepo.find({
        where: { returnedOn: IsNull() },
        relations: { gear: true }
    });

    const checkedOutIds = new Set(openCheckouts.map((c) => c.gear.id));

    const availableGear = allGear.filter(gear => !checkedOutIds.has(gear.id))

    return { availableGear, members };
}

async function newForm(req, res) {
    const data = await loadFormData();
    res.render("Checkout/new", { title: "Check Out Gear", ...data, error: null, form: {} });
}

async function create(req, res) {
    const gearId = parseId(req.body.gearId);
    const memberId = parseId(req.body.memberId);
    const dueOn = req.body.dueOn;

    const checkoutRepo = postgres.getRepository("Checkout");

    let error = null;

    if (gearId === null || memberId === null) {
        error = "Please choose gear and a member.";
    } else {
        const openCount = await checkoutRepo.count({
            where: { gear: { id: gearId }, returnedOn: IsNull() }
        });

        if (openCount > 0) {
            error = "That gear is already checked out.";
        } else if (dueOn < today()) {
            error = "The due date can't be before today.";
        }
    }

    if (error) {
        const data = await loadFormData();
        return res.status(400).render("Checkout/new", {
            title: "Check Out Gear", ...data, error, form: req.body
        });
    }

    await checkoutRepo.save({
        checkedOutOn: today(),
        dueOn,
        gear: { id: gearId },
        member: { id: memberId }
    });

    res.redirect("/checkouts");
}

async function markReturned(req, res) {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(404).send("Checkout not found");
    }

    const checkoutRepo = postgres.getRepository("Checkout");

    const checkout = await checkoutRepo.findOne({ where: { id } });

    if (!checkout) {
        return res.status(404).send("Checkout not found");
    }

    checkout.returnedOn = today();

    await checkoutRepo.save(checkout);

    res.redirect(req.get("Referer") || "/checkouts");
}
module.exports = { index, newForm, create, markReturned };