const {EntitySchema} = require("typeorm");
const Gear = require("../models/Gear");

module.exports = new EntitySchema({
    name: "Gear",
    target: Gear,
    tableName: "gear",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: "increment" 
        },
        name: { 
            type: "varchar",
            length: 100 
        },
        category: { 
            type: "varchar",
            length: 50
        },
        condition: {
            type: "varchar",
            length: 30,
            default: "Good"
        },
        dailyFee: {
            name: "daily_fee",
            type: "float",
            default: 0
        },
        description: {
            type: "text",
             nullable:true
        },
    },
})