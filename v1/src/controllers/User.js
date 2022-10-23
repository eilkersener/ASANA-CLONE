//const {insert,list,loginUser,modify,remove,} = require('../services/Users');
//const projectService = require('../services/Projects');
const httpStatus = require('http-status');
const {passwordTOHash,generateAccessToken, generateRefreshToken,} = require('../scripts/utils/helper');
const uuid = require('uuid');
const eventEmitter = require('../scripts/events/eventEmitter');
const path = require('path');

const userService = require('../services/UserService');

const projectService = require('../services/ProjectService');

class User {

create(req, res) {
  req.body.password = passwordTOHash(req.body.password);

  userService.create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

login(req, res) {
  req.body.password = passwordTOHash(req.body.password);
  userService.findOne(req.body)
    .then((user) => {
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: 'boyle bir kullanıcı yok!' });
      user = {
        ...user.toObject(), //datanın butun gereksiz bilgilerini getiriyor bu metodu yazmazsak eğer
        tokens: {
          acces_token: generateAccessToken(user),
          //JWT şifrelerken key olarak "name" aldığı içn ve bizde name olmadığı için(full_name) dönüştürduk
          refresh_token: generateRefreshToken(user),
        },
      };
      //delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

index(req, res) {
  userService.list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

projectList(req, res) {
  projectService
    .list({ user_id: req.user?._id })
    .then((projects) => {
      res.status(httpStatus.OK).send(projects);
    })
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Listelerken bir hata oluştu' });
    });
};
resetPassword(req, res) {
  const new_password =
    uuid.v4()?.split('-')[0] || `user-${new Date().getTime()}`;
  req.body.email;
  userService.updateWhere({ email: req.body.email }, { password: passwordTOHash(new_password) })
    .then((updatedUser) => {
      if (!updatedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: 'Böyle bir kullanıcı bulunmamaktadır.' });
      eventEmitter.emit('send_email', {
        to: updatedUser.email, // list of receivers
        subject: 'Şifre sıfırlama ✔', // Subject line
        html: `<b>talebiniz üzerine şifre sıfırlama işlemi gerçekleşmiştir.</b> Yeni şifreniz: <b>${new_password}<br/>`, // html body
      });
      res.status(httpStatus.OK).send({
        messeage:
          'şifre sıfırlama işlemi için email üzerinden gereken bilgileri gönderdik',
      });
    })
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'şifre resetleme hatası' });
    });
};
update(req, res) {
  userService.update(req.user?._id, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Güncelleme sırasında hata oluştu' });
    });
};
changePassword(req, res) {
  req.body.password = passwordTOHash(req.body.password);
  //UI geldıkten sonra şifre karşılaştırmalarıyla ilgili kurallar burada yer alacaktır.

  userService.update(req.body,req.user?._id)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Güncelleme sırasında hata oluştu' });
    });
};
deleteUser(req, res) {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'ID bilgisi eksik',
    });
  }
  userService.delete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: 'Böyle bir kayıt bulunmamaktadır' });
      }
      res.status(httpStatus.OK).send({ message: 'User başarıyla silinmiştir' });
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Silme işlemı sırasında hata' });
    });
};
updateProfileImage(req, res) {
    //resim kontrolu
   if (!req.files.profile_image) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: ' İşlem yapılamadı' });
  }
   const extension = path.extname(req.files.profile_image.name);
   const fileName = `${req?.user._id}${extension}`;
   const folderPath = path.join(__dirname,'../','uploads/users',fileName);
   req.files.profile_image.mv(folderPath, function (err) {
     if (err) {
      console.log(err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: ' İşlem yapılamadı' });
     }
    userService.update(req.user?._id, {profile_image: fileName}).then((updatedUser)=>{
      res.status(httpStatus.OK).send(updatedUser)
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "update başarılı fakat kayıt sırasında bir problem oluştu"}))
   });
};
}
module.exports = new User();
