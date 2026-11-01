function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) ? id : null;
}

module.exports = { parseId }