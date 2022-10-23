const Mongoose = require('mongoose');
const logger = require('../scripts/logger/Tasks');


const TaskSchema = new Mongoose.Schema({
    title:String,
    description:String,
    assigned_to : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    due_date: Date,
    statuses:[String],
    section_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "section",
    },

    user_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    project_id : {
        type: Mongoose.Schema.Types.ObjectId,
        ref:"project",
    },
    oreder: Number,
    isCompleted:Boolean,
    comments: [{
        comment:String,
        commented_at:Date,
        user_id:{
            type: Mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    }],
    media:[String],
    sub_tasks:[{
        type: Mongoose.Schema.Types.ObjectId,
        ref:"task",
    }]

},
{timestamps: true, versionKey: false});

 
 TaskSchema.post("save", (doc)=>{
     logger.log({
         level:"info",
        message : doc,
   }) 
     // ... kayıt edilmiştir... Loglama...
 })


module.exports = Mongoose.model("task", TaskSchema);