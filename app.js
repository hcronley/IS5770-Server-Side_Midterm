require("reflect-metadata");
require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;
const { today } = require("./utils/dates");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:true }));
app.use(express.static("public"));

const postgres = require("./app-data-source");
const { IsNull, LessThan } = require("typeorm");

// GET request to /
app.get('/', async (req, res) => {
  const gearRepo = postgres.getRepository("Gear");
  const memberRepo = postgres.getRepository("Member");
  const checkoutRepo = postgres.getRepository("Checkout");

  const gearCount = await gearRepo.count();
  const checkedOutCount = await checkoutRepo.count({
    where: { returnedOn: IsNull() },
  })

  const memberCount = await memberRepo.count();

  const overdueCount = await checkoutRepo.count({
    where: { returnedOn: IsNull(), dueOn: LessThan(today()) },
  })

  const dueNext = await checkoutRepo.find({
    where: { returnedOn: IsNull() },
    relations: { gear: true, member: true },
    order: { dueOn: "ASC" },
  });

  res.render("index", 
    { title: "Dashboard",
      gearCount,
      memberCount,
      checkedOutCount,
      overdueCount,
      dueNext,
      today: today()
    });
});

const gearRouter = require("./routes/Gear");
app.use("/gear", gearRouter);

const memberRouter = require("./routes/Member");
app.use("/members", memberRouter);

const checkoutRouter = require("./routes/Checkouts");
app.use("/checkouts", checkoutRouter);

postgres.initialize().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})