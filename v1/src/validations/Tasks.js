const Joi = require('joi');

const createValidation = Joi.object({
    title : Joi.string().required().min(2),
    section_id: Joi.string().required().min(8),
    project_id: Joi.string().required().min(8),
    description : Joi.string().min(2),
    assigned_to : Joi.string().min(2),
    due_date : Joi.string(),
    statuses : Joi.array(),
    order: Joi.number(),
    isCompleted: Joi.boolean(),
    comments: Joi.array(),
    media: Joi.array(),
    sub_task: Joi.array()
})
const updateValidation = Joi.object({
    title : Joi.string().min(2),
    section_id: Joi.string().min(8),
    project_id: Joi.string().min(8),
    description : Joi.string().min(2),
    assigned_to : Joi.string().min(2),
    due_date : Joi.string(),
    statuses : Joi.array(),
    order: Joi.number(),
    isCompleted: Joi.boolean(),
    comments: Joi.array(),
    media: Joi.array(),
    sub_task: Joi.array()

})
const commentValidation = Joi.object({
    comment : Joi.string().min(2),

})


module.exports = {
    createValidation,
    updateValidation,
    commentValidation,
}