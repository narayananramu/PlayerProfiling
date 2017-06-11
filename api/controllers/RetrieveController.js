/**
 * RetrieveController
 *
 * @description :: Server-side logic for managing Retrieves
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var axios = require('axios');
var promise = require('bluebird');
module.exports = {
  'player': function(request,response,next){
    if(request.body.q){
      axios
        .get("https://euw.api.riotgames.com/api/lol/EUW/v1.4/summoner/by-name/"+request.body.q+"?api_key=RGAPI-aadefd70-0d4b-4d21-9d4f-9f4ad37e2f91")
        .then(function(responseResult) {
          if (responseResult.data != '') {
            axios
              .get("https://euw.api.riotgames.com/api/lol/EUW/v1.3/stats/by-summoner/"+responseResult.data[request.body.q]['id']+"/ranked?season=SEASON2017&api_key=RGAPI-aadefd70-0d4b-4d21-9d4f-9f4ad37e2f91")
              .then(function(responseResult2){
                if(responseResult2.data != ''){
                  var createPlayer = Player.create({
                    "summonerLevel": responseResult.data[request.body.q]['summonerLevel'],
                    "profileIconId": responseResult.data[request.body.q]['profileIconId'],
                    "revisionDate": responseResult.data[request.body.q]['revisionDate'],
                    "player_id": responseResult.data[request.body.q]['id'],
                    "name": responseResult.data[request.body.q]['name'],
                    "champions": responseResult2.data.champions
                  });
                  createPlayer.then(function (createPlayerresult) {
                    return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{data: createPlayerresult});
                  });
                  createPlayer.fail(function(createPlayerError){
                    console.log(createPlayerError);
                    return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{error: true});
                  })
                }
                else{
                  return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{data: null});
                }
              });
          }
          else{
            return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{data: null});
          }
        })
        .catch(function(responseError){
          return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{error: true});
        });
    }
    else{
      return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{error: true});
    }
  }
};

