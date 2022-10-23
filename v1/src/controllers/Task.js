const httpStatus = require('http-status');
const taskService = require('../services/TaskService');

class Task {
  index(req, res) {
    if(!req?.params?.projectId) return res.status(httpStatus.BAD_REQUEST).send({error : "proje bilgisi eksik"})
    taskService.list({project_id: req.params.projectId})
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
  
    taskService.create(req.body)
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
    taskService.update( req.params?.id,req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) => {
        console.log(e)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })
      });
  };
  deleteTasks(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: 'ID bilgisi eksik',
      });
    }
    taskService.delete(req.params.id)
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
  makeComment(req,res) {             //HASHARRAY
    taskService.findOne({_id : req.params.id}).then((mainTask)=>{
      if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({message: " Böyle bir kayıt bulunamadı"})
      const comment = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      }
      mainTask.comments.push(comment);
      mainTask.save().then((updatedDoc)=>{
      return res.status(httpStatus.OK).send(updatedDoc)
      }).catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
    }).catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
  }
  deleteComment(req,res) {
    taskService.findOne({_id : req.params.id}).then((mainTask)=>{
      if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({message: " Böyle bir kayıt bulunamadı"})
      
      mainTask.comments = mainTask.comments.filter((c) => c._id?.toString() !== req.params.commentId);
      mainTask.save().then((updatedDoc)=>{
      return res.status(httpStatus.OK).send(updatedDoc)
      }).catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
    }).catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
  }
  addSubTask (req,res) {
     if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({messagee : " id bilgisi gerekli"})
     taskService.findOne({_id : req.params.id}).then((mainTask)=>{
      if(!mainTask) return res.status(httpStatus.NOT_FOUND).send({message: " Böyle bir kayıt bulunamadı"})
      
      taskService.create({...req.body, user_id: req.user})
      .then((sutbTask) => {
        mainTask.sub_tasks.push(sutbTask);
        mainTask.save().then((updatedDoc)=>{
          return res.status(httpStatus.OK).send(updatedDoc)
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
     
    }).catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
  }).catch((e) => {
    console.log(e)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'kayıt sırasında hata' })});
  }
  getSubTask(req,res) {
    if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({messagee : " id bilgisi gerekli"})
    taskService.findOne({_id : req.params.id},true).then((task)=>{
      if(!task) return res.status(httpStatus.NOT_FOUND).send({message: " Böyle bir kayıt bulunamadı"})
      res.status(httpStatus.OK).send(task)
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
  })}
}
module.exports = new Task();



