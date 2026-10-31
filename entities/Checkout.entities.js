const {EntitySchema} = require("typeorm");
const Checkout = require("../models/Checkout");

module.exports = new EntitySchema({
    name: "Checkout",
    target: Checkout,
    tableName: "checkouts",
    columns: {
        id: { 
            type: "int",
             primary: true,
              generated: "increment"
        },
        checkedOutOn: {
            name: "checked_out_on",
            type: "date"
        },
        dueOn: {
            name: "due_on",
            type: "date"
        },
        returnedOn: {
            name: "returned_on",
            type: "date",
            nullable: true
        },
    },
    relations: {
        gear: {
            type: "many-to-one",
            target: "Gear",
            joinColumn: { name: "gear_id" }
        },
        member: {
            type: "many-to-one",
            target: "Member",
            joinColumn: { name: "member_id" }
        }
    },
})
