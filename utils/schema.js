const Joi=require("joi");
module.exports.postSchema=Joi.object({
post:Joi.object({
   title:Joi.string().required(),
   caption:Joi.string().required(),
   location:Joi.string().required(),
   country:Joi.string().required(),
   image:Joi.string().allow("",null),
}).required(),
});
module.exports.commentSchema=Joi.object({
   comment:Joi.object({
      comment:Joi.string().required()
   }).required(),
})