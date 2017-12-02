var game
var backgroundColor = 'linear-gradient(-90deg, #002B5C, #C4CED4, #E31837)'
var selectedMonth

$(document).ready(function(){
  getGame()
})


function getGame(){
  var date = Date.today()

  if (date.getDate().toString().length === 1) {
    var day = `0${date.getDate().toString()}`
    console.log(day)
  } else {
    day = date.getDate()
  }

  if (date.getMonth().toString().length === 1) {
    var month = `0${date.getMonth() + 1}`
  } else {
    month = date.getMonth() + 1
  }

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
    console.log(response)
    game = response.games.filter(function(game){
      return game.hTeam.triCode === 'WAS' || game.vTeam.triCode === 'WAS'
      console.log(game)
    })

    if (typeof game === 'object' && game.isGameActivated === true) {

      console.log(typeof(game[0]))
      console.log(game[0])

      $('.loading').hide()
      $('.container').show()
      $('.scoreboard').show()
      $('.hidden').show()
      $('body').css('background', backgroundColor)
      $('.scowlWall').fadeIn(1000)
      $('.tweetButton').show()

      if (game[0].period.isHalftime === true) {
        var text = `<h1><span class="nope">Game underway.</span> We're at halftime at the ${game[0].arena.name} in ${game[0].arena.city}. ${game[0].hTeam.triCode}: ${game[0].hTeam.score}, ${game[0].vTeam.triCode}: ${game[0].vTeam.score}.</h1>`
      } else if (game[0].period !== 2 && game[0].period !== 4 && game[0].period.isEndOfPeriod === true){
        var text = `<h1><span class="nope">Game underway.</span> We're through with quarter number ${game[0].period.current} at the ${game[0].arena.name} in ${game[0].arena.city}. ${game[0].hTeam.triCode}: ${game[0].hTeam.score}, ${game[0].vTeam.triCode}: ${game[0].vTeam.score}.</h1>`
    } else if (game[0].period === 4 && game[0].period.isEndOfPeriod === true) {
      var text = `<h1>After four quarters at the ${game[0].arena.name} in ${game[0].arena.city}. ${game[0].hTeam.triCode}: ${game[0].hTeam.score}, ${game[0].vTeam.triCode}: ${game[0].vTeam.score}.</h1>`
    } else {
      if (game[0].clock.includes('.')) {
        var text = `<h1><span class="nope">Game underway.</span> We have ${game[0].clock} seconds left in quarter number ${game[0].period.current} at the ${game[0].arena.name} in ${game[0].arena.city}. ${game[0].hTeam.triCode}: ${game[0].hTeam.score}, ${game[0].vTeam.triCode}: ${game[0].vTeam.score}.</h1>`
      } else {
        var text = `<h1><span class="nope">Game underway.</span> We have ${game[0].clock} left in quarter number ${game[0].period.current} at the ${game[0].arena.name} in ${game[0].arena.city}. ${game[0].hTeam.triCode}: ${game[0].hTeam.score}, ${game[0].vTeam.triCode}: ${game[0].vTeam.score}.</h1>`
        }
      }

      $(text).hide().appendTo('.text').delay(200).fadeIn(1000)

      $('.homeTeamName').append(`${game[0].hTeam.triCode}`)
      $('.awayTeamName').append(`${game[0].vTeam.triCode}`)

      $('.homeTeamScore').append(`<h1><span class="currentHomeScore">00</span></h1>`)
      $('.awayTeamScore').append(`<h1><span class="currentVisitingScore">00</span></h1>`)

      $('.home').delay(400).fadeIn(1000)
      $('.away').delay(400).fadeIn(1000)


      $('.currentHomeScore').delay(1000).animateNumber({ number: parseInt(game[0].hTeam.score) })
      $('.currentVisitingScore').delay(1000).animateNumber({ number: parseInt(game[0].vTeam.score) })

      var linkText = $('.text').text()
      linkText = linkText.split(' ')
      var filteredLinkText = linkText.filter(function(char){
        return char !== ''
      })
      console.log(filteredLinkText.join(' '))

      var tweetHtml = `<a href="https://twitter.com/intent/tweet?text=${filteredLinkText.join(' ').trim()}"
      class="twitter-share-button" data-show-count="true" data-size="large" data-hashtags="Wizards" data-via="Did_The_Wiz_Win">Tweet</a
      ><script async src="https://platform.twitter.com/widgets.js"
      charset="utf-8"></script>`
      $(tweetHtml).hide().appendTo('.tweetButton')
      $('.tweetButton').delay(500).fadeIn(1000)

    } else {

      var url2 = `https://cors-anywhere.herokuapp.com/http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/league/00_full_schedule.json`
      var lastGame
      var arr = []
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

      $.ajax({
        url: url2,
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
          $('.scoreboard').hide()
          $('.loading').show()
        }
      }).done((response) => {
        console.log(months[months.indexOf(Date.today().toString('MMMM')) - 1])
        for (i = 0; i < response.lscd.length; i++){
          if (response.lscd[i].mscd.mon === Date.today().toString('MMMM')) {
            var filter = response.lscd[i].mscd.g.filter(function(game){
              return game.h.tn === 'Wizards' || game.v.tn === 'Wizards'
            })
            for (i = 0; i < filter.length; i++) {
              if (filter[i].stt === 'Final') {
                arr.push(filter[i])
              }
            }
            if (arr.length > 0) {
            var lastGame = arr.pop()
          } else {
            var selectedMonth = response.lscd.filter(function(item){
              return item.mscd.mon === months[months.indexOf(Date.today().toString('MMMM')) - 1]
            })
            console.log(selectedMonth)
            var filter = selectedMonth[0].mscd.g.filter(function(game){
              return game.h.tn === 'Wizards' || game.v.tn === 'Wizards'
            })
            for (i = 0; i < filter.length; i++) {
              if (filter[i].stt === 'Final') {
                arr.push(filter[i])
              }
            }
            var lastGame = arr.pop()
          }
        }
      }

        var arr3 = []
        arr3.push(lastGame.gdte.split('-')[1])
        arr3.push(lastGame.gdte.split('-')[2])
        arr3.push(lastGame.gdte.split('-')[0])
        var lastGameTime = arr3.join('/')

        $('.loading').hide()
        $('.scoreboard').show()
        $('.hidden').show()
        $('body').css('background', backgroundColor)
        // $('.tweetButton').show()

        if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) < parseInt(lastGame.v.s)) {
                if (lastGame.ptsls.pl.length > 0) {
                var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.h.tn} lost to the
                ${lastGame.v.tn} on ${lastGameTime} in ${lastGame.ac}. ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers
                with ${lastGame.ptsls.pl[0].val} points. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                $('.sadWall').fadeIn(1000)
              } else {
                var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.h.tn} lost to the
                ${lastGame.v.tn} on ${lastGameTime} in ${lastGame.ac}. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                $('.sadWall').fadeIn(1000)
              }
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) < parseInt(lastGame.h.s)){
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.v.tn} lost to the ${lastGame.h.tn}
                  on ${lastGameTime} in ${lastGame.ac}. ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers
                  with ${lastGame.ptsls.pl[0].val} points. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.sadWall').fadeIn(1000)
                } else {
                  var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.v.tn} lost to the ${lastGame.h.tn}
                  on ${lastGameTime} in ${lastGame.ac}. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.sadWall').fadeIn(1000)
                }
        } else if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) > parseInt(lastGame.v.s)) {
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.h.tn} beat the ${lastGame.v.tn} on ${lastGameTime}
                  in ${lastGame.ac}. ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers with ${lastGame.ptsls.pl[0].val}
                  points. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.happyWall').fadeIn(1000)
                } else {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.h.tn} beat the ${lastGame.v.tn} on ${lastGameTime}
                  in ${lastGame.ac}. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.happyWall').fadeIn(1000)
                }
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) > parseInt(lastGame.h.s)){
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.v.tn} beat the ${lastGame.h.tn} on ${lastGameTime} in ${lastGame.ac}.
                   ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers with ${lastGame.ptsls.pl[0].val} points. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.happyWall').fadeIn(1000)
                } else {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.v.tn} beat the ${lastGame.h.tn} on ${lastGameTime} in ${lastGame.ac}.
                  The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('.happyWall').fadeIn(1000)
                }
        }

        $('.homeTeamName').append(`${lastGame.h.ta}`)
        $('.awayTeamName').append(`${lastGame.v.ta}`)

        $('.homeTeamScore').append(`<h1><span id="homeScore">00</span></h1>`)
        $('.awayTeamScore').append(`<h1><span id="visitingScore">00</span></h1>`)

        $('.home').delay(400).fadeIn(1000)
        $('.away').delay(400).fadeIn(1000)

        $('#homeScore').delay(1000).animateNumber({ number: parseInt(lastGame.h.s)})
        $('#visitingScore').delay(1000).animateNumber({ number: parseInt(lastGame.v.s)})

        var linkText = $('.text').text()
        linkText = linkText.split(' ')
        var filteredLinkText = linkText.filter(function(char){
          return char !== ''
        })
        console.log(filteredLinkText.join(' '))

        var tweetHtml = `<a href="https://twitter.com/intent/tweet?text=${filteredLinkText.join(' ').trim()}"
        class="twitter-share-button" data-show-count="true" data-size="large" data-hashtags="Wizards" data-via="Did_The_Wiz_Win">Tweet</a
        ><script async src="https://platform.twitter.com/widgets.js"
        charset="utf-8"></script>`
        $(tweetHtml).hide().appendTo('.tweetButton')
        $('.tweetButton').delay(500).fadeIn(1000)

      })

    }

  })

}
