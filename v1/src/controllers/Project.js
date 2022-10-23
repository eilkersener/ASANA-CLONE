const httpStatus = require('http-status');
const projectService = require('../services/ProjectService');
const ApiError = require('../errors/ApiError');

class Project {
  index(req, res)  {
    projectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  };
  create(req, res){
    console.log(req.user);
    req.body.user_id = req.user;
  
    projectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  update(req, res, next){
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: 'ID bilgisi eksik',
      });
    }
    projectService.update(req.params.id,req.body)
      .then((updatedProject) => {
        if(!updatedProject) return next(new ApiError("Böyle bir kayıt bulunmamaktadır",404));
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) => {
        console.log(e)
        next(new ApiError(e?.message)) 
      }
        );
  };
  deleteProject(req, res){
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: 'ID bilgisi eksik',
      });
    }
    projectService.delete(req.params.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: 'Böyle bir kayıt bulunmamaktadır' });
        }
        res
          .status(httpStatus.OK)
          .send({ message: 'Proje başarıyla silinmiştir' });
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: 'Silme işlemı sırasında hata' });
      });
  };
}
module.exports = new Project();

