var game

$(document).ready(function(){
  getGame()
})


function getGame(){
  var date = Date.today()
  var day = date.getDate()
  var month = date.getMonth() + 1
  var year = date.getYear() + 1900
  var url = `https://cors-anywhere.herokuapp.com/http://data.nba.net/10s/prod/v2/${year}${month}${day}/scoreboard.json`
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    beforeSend: function(){
      $('.container').hide()
      $('.loading').show()
    }
  }).done((response) => {
    game = response.games.filter(function(game){
      return game.hTeam.triCode === 'WAS' || game.vTeam.triCode === 'WAS'
    })

    if (typeof game[0] !== 'undefined') {

      if (game[0].isGameActivated) {

      $('.loading').hide()
      $('.container').show()

      $('.summary').append(`<h1><span class="nope">Game underway</span> in ${game[0].arena.city}</h1>`)

      $('.homeTeamName').append(`<h1>${game[0].hTeam.triCode}</h1>`)
      $('.awayTeamName').append(`<h1>${game[0].vTeam.triCode}</h1>`)
      $('.homeTeamScore').append(`<h1>${game[0].hTeam.score}</h1>`)
      $('.awayTeamScore').append(`<h1>${game[0].vTeam.score}</h1>`)

      }

    } else {

      var url2 = `https://cors-anywhere.herokuapp.com/http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/league/00_full_schedule.json`
      var lastGame
      var arr = []

      $.ajax({
        url: url2,
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
          $('.container').hide()
          $('.loading').show()
        }
      }).done((response) => {
        for (i = 0; i < response.lscd.length; i++){
          if (response.lscd[i].mscd.mon === Date.today().toString('MMMM') || parseInt(response.lscd[i].mscd.mon) + 1 === Date.today().toString('MMMM') || parseInt(response.lscd[i].mscd.mon) - 1 === Date.today().toString('MMMM'))  {
            var filter = response.lscd[i].mscd.g.filter(function(game){
              return game.h.tn === 'Wizards' || game.v.tn === 'Wizards'
            })
            for (i = 0; i < filter.length; i++) {
              if (filter[i].stt === 'Final') {
                arr.push(filter[i])
              }
            }
            var lastGame = arr.pop()
            console.log(lastGame)
          }
        }

        var arr3 = []
        arr3.push(lastGame.gdte.split('-')[1])
        arr3.push(lastGame.gdte.split('-')[2])
        arr3.push(lastGame.gdte.split('-')[0])
        var lastGameTime = arr3.join('-')

        $('.loading').hide()
        $('.container').show()
        if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) < parseInt(lastGame.v.s)) {
          $('.summary').append(`<h1><span class="nope">Nope.</span> The ${lastGame.h.tn} (${lastGame.h.re}) lost to the ${lastGame.v.tn} (${lastGame.v.re}) on ${lastGameTime}.</h1>`)
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) < parseInt(lastGame.h.s)){
          $('.summary').append(`<h1><span class="nope">Nope.</span> The ${lastGame.v.tn} (${lastGame.v.re}) lost to the ${lastGame.h.tn} (${lastGame.h.re}) on ${lastGameTime}.</h1>`)
        } else if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) > parseInt(lastGame.v.s)) {
            $('.summary').append(`<h1>Yep! The ${lastGame.h.tn} (${lastGame.h.re}) beat the ${lastGame.v.tn} (${lastGame.v.re}) on ${lastGameTime}.</h1>`)
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) > parseInt(lastGame.h.s)){
            $('.summary').append(`<h1>Yep! The ${lastGame.v.tn} (${lastGame.v.re}) beat the ${lastGame.h.tn} (${lastGame.h.re}) on ${lastGameTime}.</h1>`)
        }

        $('.homeTeamName').append(`<h1>${lastGame.h.ta}</h1>`)
        $('.awayTeamName').append(`<h1>${lastGame.v.ta}</h1>`)
        $('.homeTeamScore').append(`<h1><span id="homeScore">00</span></h1>`)
        $('.awayTeamScore').append(`<h1><span id="visitingScore">00</span></h1>`)
        
        $('#homeScore').animateNumber({ number: parseInt(lastGame.h.s)})
        $('#visitingScore').animateNumber({ number: parseInt(lastGame.v.s)})
      })

    }

  })

}
