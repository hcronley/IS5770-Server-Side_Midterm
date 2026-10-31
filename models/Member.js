class Member {
    constructor( id, firstName, lastName, email, joinedOn ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.joinedOn = joinedOn;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

module.exports = Member;
