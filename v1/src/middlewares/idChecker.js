const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

const idChecker = (field)=> (req, res, next) =>{   //regex videosuna bak
    if(!req?.params[field || "id"]?.id?.match(/^[0-9a-f-A-F]{24}$/)){
    next(new ApiError("LÜtfen geçerli bir ID bilgisi giriniz", httpStatus.BAD_REQUEST));
    return;
    }
    next();
}
module.exports = idChecker;