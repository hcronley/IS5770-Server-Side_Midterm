const {EntitySchema} = require("typeorm");
const Member = require("../models/Member");

module.exports = new EntitySchema({
    name: "Member",
    target: Member,
    tableName: "members",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: "increment" 
        },
        firstName: {
            name: "first_name",
            type: "varchar",
            length: 50
        },
        lastName: {
            name: "last_name",
            type: "varchar",
            length: 50
        },
        email: {
            type: "varchar",
            length: 100,
            unique: true
        },
        joinedOn: {
            name: "joined_on",
            type: "date"
        }
    },
})