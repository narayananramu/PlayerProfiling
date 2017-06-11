/**
 * SearchController
 *
 * @description :: Server-side logic for managing Searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var Axios = require('axios');
function retriveChampion(champion_id, cb) {
  Axios
    .get("https://global.api.riotgames.com/api/lol/static-data/EUW/v1.2/champion/"+champion_id+"?api_key=RGAPI-aadefd70-0d4b-4d21-9d4f-9f4ad37e2f91")
    .then(function(result3){
      if(result3.data){
        cb({error: false, data: result3.data})
      }
      else{
        cb({error: true})
      }
    }) 
    .catch(function(error3){
      cb({error: true})
    });
}
module.exports = {
  'index': function (request,response,next) {
    return response.render('Search/search.ejs',{title: "Search"})
  },
  'searchByName': function (request,response,next) {
    if(request.body.q){
      var searchQuery = Player.find({name: request.body.q});
      searchQuery.then(function (searchResult) {
        if(searchResult.length != 0){
          return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{data: searchResult[0]});
        }
        else{
          next();
        }
      });
      searchQuery.fail(function(searchError){
        return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{error: true});
      });
    }
    else{ 
      return sails.sockets.broadcast(request.session.roomName, 'summonerDetails',{error: true});
    }
  }
};

