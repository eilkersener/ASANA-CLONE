const httpStatus = require('http-status');
const sectionService = require('../services/SectionService')

class Section {
  index(req, res) {
    if(!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({error : "proje bilgisi eksik"})
    sectionService.list({project_id: req.params.projectId})
      .then((response) => {
      
        res.status(httpStatus.OK).send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  };
  
  create(req, res) {
  
    req.body.user_id = req.user;
  
    sectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  update(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: 'ID bilgisi eksik',
      });
    }
    sectionService.update(req.body, req.params.id)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: 'kayıt sırasında hata' })
      );
  };
  deleteSection(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: 'ID bilgisi eksik',
      });
    }
    sectionService.delete(req.params.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: 'Böyle bir kayıt bulunmamaktadır' });
        }
        res
          .status(httpStatus.OK)
          .send({ message: 'Kayıt başarıyla silinmiştir' });
      })
      .catch((e) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: 'Silme işlemı sırasında hata' });
      });
  };
}
module.exports = new Section();

