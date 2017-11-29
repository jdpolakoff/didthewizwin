var game
$('.rest').fadeIn(1200)


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
      console.log(game)
    })

    if (typeof game !== 'undefined' && game[0].isGameActivated !== false) {

      console.log(game[0])

     // && game[0].isGameActivated === false) {

      $('.loading').hide()
      $('.container').show()
      $('.innercontain').show()
      $('body').css('background', 'linear-gradient(-90deg, #002B5C, #E31837, #C4CED4)')
      $('.innercontain').append(`<h1 class="toptext"><span class="nope">Game underway.</span> We're in quarter number ${game[0].period.current} at the ${game[0].arena.name} in ${game[0].arena.city}:</h1>`)

      $('.homeTeamName').append(`<h1>${game[0].hTeam.triCode}</h1>`)
      $('.awayTeamName').append(`<h1>${game[0].vTeam.triCode}</h1>`)
      $('.homeTeamScore').append(`<h1><span class="currentHomeScore">00</span></h1>`)
      $('.awayTeamScore').append(`<h1><span class="currentVisitingScore">00</span></h1>`)

      $('.currentHomeScore').animateNumber({ number: parseInt(game[0].hTeam.score) })
      $('.currentVisitingScore').animateNumber({ number: parseInt(game[0].vTeam.score) })

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
          if (response.lscd[i].mscd.mon === Date.today().toString('MMMM') || parseInt(response.lscd[i].mscd.mon) + 1 === parseInt(Date.today().toString('MMMM')) || parseInt(response.lscd[i].mscd.mon) - 1 === parseInt(Date.today().toString('MMMM')))  {
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
        var lastGameTime = arr3.join('/')

        $('.loading').hide()
        $('.container').show()

        $('body').css('background', 'linear-gradient(-90deg, #002B5C, #E31837, #C4CED4)')

        if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) < parseInt(lastGame.v.s)) {
          var text = `<h1><span class="nope">Nope.</span> The ${lastGame.h.tn} lost <span id="homeScore">00</span>-<span id="visitingScore">00</span> to the
          ${lastGame.v.tn} on ${lastGameTime}. The Wizards are now ${lastGame.h.re} on the season.</h1>`
          $(text).hide().appendTo('.scoreboard').delay(500).fadeIn(2000)
          $('.sadWall').delay(500).fadeIn(1000)
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) < parseInt(lastGame.h.s)){
          var text = `<h1><span class="nope">Nope.</span> The ${lastGame.v.tn} lost
           <span id="visitingScore">00</span>-<span id="homeScore">00</span> to the ${lastGame.h.tn}
            on ${lastGameTime}. The Wizards are now ${lastGame.v.re} on the season.</h1>`
            $(text).hide().appendTo('.scoreboard').delay(500).fadeIn(2000)
            $('.sadWall').delay(500).fadeIn(1000)
        } else if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) > parseInt(lastGame.v.s)) {
            var text = `<h1><span class="nope">Yep!</span> The ${lastGame.h.tn} beat the ${lastGame.v.tn}
            <span id="homeScore">00</span>-<span id="visitingScore">00</span> on ${lastGameTime}. The Wizards
            are now ${lastGame.h.re} on the season.</h1>`
            $(text).hide().appendTo('.scoreboard').fadeIn(1000)
            $('.happyWall').delay(500).fadeIn(1000)
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) > parseInt(lastGame.h.s)){
            var text = `<h1><span class="nope">Yep!</span> The ${lastGame.v.tn}
            beat the ${lastGame.h.tn} <span id="visitingScore">00</span>-<span id="homeScore">00</span>
            on ${lastGameTime}. The Wizards are now ${lastGame.v.re} on the season.</h1>`
            $(text).hide().appendTo('.scoreboard').fadeIn(1000)
            $('.happyWall').delay(500).fadeIn(1000)
        }

        // $('.homeTeamName').append(`<h1>${lastGame.h.ta}</h1>`)
        // // $('.awayTeamName').append(`<h1>${lastGame.v.ta}</h1>`)
        // $('.homeTeamScore').append(`<h1><span id="homeScore">00</span></h1>`)
        // $('.awayTeamScore').append(`<h1><span id="visitingScore">00</span></h1>`)
        $('#homeScore').animateNumber({ number: parseInt(lastGame.h.s)})
        $('#visitingScore').animateNumber({ number: parseInt(lastGame.v.s)})
      })

    }

  })

}
