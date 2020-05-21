const MongoDB = require('./mongoDB')

const {Types} = require('mongoose')

class ModelMongoDB {

    constructor(schema) {
        this._collection = schema;
    }

    async create(item) {
        return this._collection.create(item)
    }
    async read(item = {}) {
        return this._collection.find(item)
    }
    async update(id, item) {
        return this._collection.updateOne({
            _id: id
        }, {
            $set: item
        })
    }

    async delete(id) {
        return this._collection.deleteOne({
            _id: id
        })
    }
}

module.exports = ModelMongoDB