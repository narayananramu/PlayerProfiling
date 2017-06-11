/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'connect': function(request,response,next){
    request.session.roomName = new Date().valueOf().toString();
    sails.sockets.join(request, request.session.roomName , function(error){
      if(error){
        console.log(error);
        response.status(500).send({error: true})
      }
      else{
        response.status(200).send({error: false})
      }
    });
  }
};

