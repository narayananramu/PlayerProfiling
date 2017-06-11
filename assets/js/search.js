$(document).ready(function(){
  var championCal = {
    totalSession: 0,
    totalWinSession: 0,
    totalLostSession: 0,
    win: 0,
    lost: 0,
    avgCS: 0,
    avgTUR: 0,
    avgMD: 0,
    avgPD: 0,
    avgCK: 0,
    avgAssists: 0,
    avgDam: 0
  };
  var summonerLevelGauge = 0;
  var summonerChampionsPlayed = 0;
  var summonerWins = 0;
  var summonerLost = 0;
  var summonerSession = 0;
  var summonerAssists = 0;
  var minionsKill = 0;
  var championKill = 0;
  var turretsKill = 0;
  var averageDamage = 0;
  var magicDamage = 0;
  var physicalDamage = 0;
  io.socket.post('/connectRoom', function (data) {
    if(data.error){
      alert("Unable estabilish Socket Connection!");
    }
    else{
      $('button#searchBtn').click(function(){
        championCal = {
          totalSession: 0,
          totalWinSession: 0,
          totalLostSession: 0,
          win: 0,
          lost: 0,
          avgCS: 0,
          avgTUR: 0,
          avgMD: 0,
          avgPD: 0,
          avgCK: 0,
          avgAssists: 0,
          avgDam: 0
        };
        summonerLevelGauge = 0;
        summonerChampionsPlayed = 0;
        summonerWins = 0;
        summonerLost = 0;
        summonerSession = 0;
        summonerAssists = 0;
        minionsKill = 0;
        championKill = 0;
        turretsKill = 0;
        averageDamage = 0;
        magicDamage = 0;
        physicalDamage = 0;
        $('div#summonerLevelGauge').html('');
        $('div#summonerChampionsPlayed').html('');
        $('div#summonerWins').html('');
        $('div#summonerLost').html('');
        $('div#summonerSession').html('');
        $('div#summonerAssists').html('');
        $('div#minionsKill').html('');
        $('div#championKill').html('');
        $('div#turretsKill').html('');
        $('div#averageDamage').html('');
        $('div#magicDamage').html('');
        $('div#physicalDamage').html('');
        io.socket.post('/searchByName', {q: $('input#searchInput').val()});
      });
    }
  });
  io.socket.on('summonerDetails', function (responseData) {
    if(responseData.error){
      alert("Internal Server Error! Try Again");
    }
    else{
      if(responseData.data != null){
        $('span#sumID').html(responseData.data['player_id']);
        $('span#sumName').html(responseData.data['name']);
        summonerLevelGauge = new JustGage({
          id: "summonerLevelGauge",
          value: responseData.data['summonerLevel'],
          min: 0,
          max: 30,
          title: "Summoner Level",
          label: "Level",
          levelColors: ["#FDB827"]
        });
        summonerChampionsPlayed = new JustGage({
          id: "summonerChampionsPlayed",
          value: responseData.data['champions'].length,
          min: 0,
          max: 136,
          title: "Champions",
          label: "Played",
          levelColors: ["#F5821F"]
        });
        responseData.data.champions.forEach(function(champion,index){
          championCal.totalSession += champion.stats.totalSessionsPlayed;
          championCal.totalWinSession += champion.stats.totalSessionsWon;
          championCal.totalLostSession += champion.stats.totalSessionsLost;
          championCal.avgCS += champion.stats.totalMinionKills;
          championCal.avgTUR += champion.stats.totalTurretsKilled;
          championCal.avgMD += champion.stats.totalMagicDamageDealt;
          championCal.avgPD += champion.stats.totalPhysicalDamageDealt;
          championCal.avgCK += champion.stats.totalChampionKills;
          championCal.avgAssists += champion.stats.totalAssists;
          championCal.avgDam += champion.stats.totalDamageDealt;
          if((responseData.data['champions'].length-index)==1){
            championCal.win = ((championCal.totalWinSession / championCal.totalSession) * 100).toFixed(2);
            championCal.lost = ((championCal.totalLostSession / championCal.totalSession) * 100).toFixed(2);

            summonerWins = new JustGage({
              id: "summonerWins",
              value: championCal.win,
              min: 0,
              max: 100,
              title: "Win",
              label: "Percentage",
              levelColors: ["#61BB46"]
            });
            summonerLost  = new JustGage({
              id: "summonerLost",
              value: championCal.lost,
              min: 0,
              max: 100,
              title: "Lost",
              label: "Percentage",
              levelColors: ["#E03A3E"]
            });
            summonerSession  = new JustGage({
              id: "summonerSession",
              value: championCal.totalSession,
              hideMinMax: true,
              title: "Total Sessions",
              label: "Played",
              levelColors: ["#61BB46"]
            });
            summonerAssists = new JustGage({
              id: "summonerAssists",
              value: ((championCal.avgAssists / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Assists",
              label: "Per Session",
              levelColors: ["#61BB46"]
            });

            minionsKill = new JustGage({
              id: "minionsKill",
              value: ((championCal.avgCS / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Minion Killed",
              label: "Per Session",
              levelColors: ["#963D97"]
            });
            championKill = new JustGage({
              id: "championKill",
              value: ((championCal.avgCK / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Champion Killed",
              label: "Per Session",
              levelColors: ["#963D97"]
            });
            turretsKill = new JustGage({
              id: "turretsKill",
              value: ((championCal.avgTUR / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Turrets Killed",
              label: "Per Session",
              levelColors: ["#963D97"]
            });
            averageDamage = new JustGage({
              id: "averageDamage",
              value: ((championCal.avgDam / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Damage Dealt",
              label: "Per Session",
              levelColors: ["#009DDC"]
            });
            magicDamage = new JustGage({
              id: "magicDamage",
              value: ((championCal.avgMD / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Magic Damage Dealt",
              label: "Per Session",
              levelColors: ["#009DDC"]
            });
            physicalDamage = new JustGage({
              id: "physicalDamage",
              value: ((championCal.avgPD / championCal.totalSession)).toFixed(2),
              hideMinMax: true,
              title: "Physical Damage Dealt",
              label: "Per Session",
              levelColors: ["#009DDC"]
            });
          }
        });
      }
      else{
        alert("No Such User!");
      }
    }
  });
});
