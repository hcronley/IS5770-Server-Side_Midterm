class Checkout {
    constructor ( id, checkedOutOn, dueOn, returnedOn, gear, member ){
        this.id = id,
        this.checkedOutOn = checkedOutOn;
        this.dueOn = dueOn;
        this.returnedOn = returnedOn;
        this.gear = gear;
        this.member = member;
    }
}

module.exports = Checkout;