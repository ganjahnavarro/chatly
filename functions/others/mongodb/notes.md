show dbs
use db_name
show collections

FIND:
    db.collection_name.find()
    db.collection_name.find().pretty()
    db.collection_name.findOne()

    FILTER BY CHILD:
        db.collection_name.find({ 'field.child_field': filterValue })

    PROJECTION (include = 1, exclude = 0):
        db.collection_name.find({}, { name: 1, id: 0 })

    SORT (ascending = 1, descending = 0):
        db.collection_name.find().sort({ sortField: 1 })

DROP:
    db.collection_name.drop()

COUNT:
    db.collection_name.count()

UPDATE:
    db.collection_name.update({}, { $set: { deleted: false } }, { multi: true })

REMOVE DOCUMENT:
    db.collection_name.remove({ field: { $exists: false } });

REMOVE FIELD:
    db.collection_name.update({}, { $unset: { field: "" } })
