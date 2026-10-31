class Gear {
    constructor(id, name, category, condition, dailyFee, description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.condition = condition;
        this.dailyFee = dailyFee;
        this.description = description;
    }
}

module.exports = Gear;