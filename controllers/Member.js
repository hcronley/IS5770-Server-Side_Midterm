const postgres = require("../app-data-source");
const { IsNull } = require("typeorm");
const { today } = require("../utils/dates");
const { parseId } = require("../utils/ids");


async function index(req, res) {
    const checkoutRepo = postgres.getRepository("Checkout");
    const memberRepo = postgres.getRepository("Member");

    const members = await memberRepo.find({ order: { lastName: "ASC" } });

    const openCheckouts = await checkoutRepo.find({
        where: { returnedOn: IsNull() },
        relations: { member: true }
    });

    const counts = {};
    openCheckouts.forEach(function (checkout) {
        const id = checkout.member.id;
        counts[id] = (counts[id] || 0) + 1;
    });

    res.render("Member/index",
        {
            title: "Members",
            members,
            counts
        });
}

async function create(req, res) {
    const memberRepo = postgres.getRepository("Member");

    const saved = await memberRepo.save({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        joinedOn: today()
    });

    res.redirect("/members/" + saved.id);
}

async function show(req, res) {
    const id = parseId(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(404).send("Member not found");
    }

    const memberRepo = postgres.getRepository("Member");
    const checkoutRepo = postgres.getRepository("Checkout");

    const member = await memberRepo.findOne({ where: { id } });

    if (!member) {
        return res.status(404).send("Member not found");
    }

    const history = await checkoutRepo.find({
        where: { member: { id } },
        relations: { gear: true, member: true },
        order: { checkedOutOn: "DESC" }
    });

    const openList = history.filter(function (checkout) {
        return checkout.returnedOn === null;
    });

    const pastList = history.filter(function (checkout) {
        return checkout.returnedOn !== null;
    });

    res.render("Member/show", {
        title: member.getFullName(),
        member,
        openList,
        pastList,
        today: today()
    });
}

module.exports = { index, create, show };