//remember to clear out the select after each query
var game
var backgroundColor = 'linear-gradient(-90deg, #002B5C, #C4CED4, #E31837)'
var selectedMonth
console.log(teams)

$(document).ready(function(){
  $('body').addClass('onLoad')
})

$('.latest h3').click(function(){
  $('body').removeClass('onLoad')
  $('.intro').hide()
  $('.wall').hide()
  $('.text').empty()
  $('.homeTeamName').empty()
  $('.awayTeamName').empty()
  $('.homeTeamScore').empty()
  $('.awayTeamScore').empty()
  $('.tweetButton').empty()
  $('body').css('background', 'white')
  $('.boxScore').hide()
  getGame()
})

$('.browse h3').click(function(){
  $('body').removeClass('onLoad')
  $('.tweetButton').empty()
  $('.boxScore').hide()
  browseGames()
})

$(document).on('click', '.homebtn', function(){
  // console.log('hi')
  // $('.scoreboard').hide()
  // $('.all').hide()
  // $('.loading').hide()
  // $('.intro').show()
  // $('body').css('background', backgroundColor)
  location.reload()
})

$(document).on('click', '.homeFromBox', function(){
  // $('.statText').remove()
  $('.boxx').hide()
  // $('.quarters').html('')
  // $('.box').html('')
  location.reload()
  $('.intro').show()
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

    if (typeof game !== 'undefined' && game.length > 0 && game[0].isGameActivated !== false) {
      // typeof game !== 'undefined' &&
      // console.log(game[0].isGameActivated)
      console.log(typeof(game[0]))
      console.log(game[0])

      $('.loading').hide()
      $('.container').show()
      $('.scoreboard').show()
      $('.hidden').show()
      $('body').css('background', backgroundColor)
      $('#scowlWall').show()
      $('.tweetButton').show()
      $('.showAll').show()

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

      $('.homebtn').delay(1000).fadeIn(1000)


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
                $('#sadWall').show()
              } else {
                var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.h.tn} lost to the
                ${lastGame.v.tn} on ${lastGameTime} in ${lastGame.ac}. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                $('#sadWall').show()
              }
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) < parseInt(lastGame.h.s)){
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.v.tn} lost to the ${lastGame.h.tn}
                  on ${lastGameTime} in ${lastGame.ac}. ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers
                  with ${lastGame.ptsls.pl[0].val} points. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#sadWall').show()
                } else {
                  var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${lastGame.v.tn} lost to the ${lastGame.h.tn}
                  on ${lastGameTime} in ${lastGame.ac}. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#sadWall').show()
                }
        } else if (lastGame.h.ta === 'WAS' && parseInt(lastGame.h.s) > parseInt(lastGame.v.s)) {
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.h.tn} beat the ${lastGame.v.tn} on ${lastGameTime}
                  in ${lastGame.ac}. ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers with ${lastGame.ptsls.pl[0].val}
                  points. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#happyWall').show()
                } else {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.h.tn} beat the ${lastGame.v.tn} on ${lastGameTime}
                  in ${lastGame.ac}. The Wizards are now ${lastGame.h.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#happyWall').show()
                }
        } else if (lastGame.v.ta === 'WAS' && parseInt(lastGame.v.s) > parseInt(lastGame.h.s)){
              if (lastGame.ptsls.pl.length > 0) {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.v.tn} beat the ${lastGame.h.tn} on ${lastGameTime} in ${lastGame.ac}.
                   ${lastGame.ptsls.pl[0].fn} ${lastGame.ptsls.pl[0].ln} led all scorers with ${lastGame.ptsls.pl[0].val} points. The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#happyWall').show()
                } else {
                  var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${lastGame.v.tn} beat the ${lastGame.h.tn} on ${lastGameTime} in ${lastGame.ac}.
                  The Wizards are now ${lastGame.v.re} on the season.</h1>`
                  $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                  $('#happyWall').show()
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

        $('.homebtn').delay(1000).fadeIn(1000)

      })

    }

  })

}


function browseGames() {
  $('.scoreboard').hide()
  $('.tweetButton').hide()
  $('.intro').hide()
  $('body').css('background', backgroundColor)
  $('.all').show()
  $('.choose').append(`<option>Choose A Game</option>`)
  $('.choose').show()
  var url3 = `https://cors-anywhere.herokuapp.com/http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/league/00_full_schedule.json`
  var gameMap
  var selects
  var arr = []

  $.ajax({
    url: url3,
    type: 'get',
    dataType: 'json'
        }).done((response) => {

          console.log(response)
          for (i = 0; i < response.lscd.length; i++) {
            for (j = 0; j < response.lscd[i].mscd.g.length; j++){
              if (response.lscd[i].mscd.g[j].h.tn === 'Wizards' || response.lscd[i].mscd.g[j].v.tn === 'Wizards') {
                arr.push(response.lscd[i].mscd.g[j])
                var filteredArr = arr.filter(function(game){
                  return game.stt === 'Final'
                })
              }
            }
          }
          console.log(filteredArr)
          var mappedFilteredArr = filteredArr.map(function(game){
            var gameArray = game.gdte.split('-')
            return `<option value="${game.gdte.split('-')}">${gameArray[1]}/${gameArray[2]}/${gameArray[0]} ${game.v.tn} at ${game.h.tn}</option>`
          })
          console.log(mappedFilteredArr)
          for (i = 0; i < mappedFilteredArr.length; i++){
            $('.choose').append($(mappedFilteredArr[i]))
          }
        })
        $('select').change(function(){
          console.log($('select').val().split(','))

          var year = $('select').val().split(',')[0]
          var month = $('select').val().split(',')[1]
          var day = $('select').val().split(',')[2]

          $('.all').hide()
          $('body').css('background', 'white')

          var url4 = `https://cors-anywhere.herokuapp.com/http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/league/00_full_schedule.json`
          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

          $.ajax({
            url: url4,
            type: 'get',
            dataType: 'json',
            beforeSend: function(){
              $('.all').hide()
              $('.loading').show()
            }
                }).done((response) => {
                  console.log(response)
                  var getMonth = response.lscd.filter(function(item){
                    return item.mscd.mon === months[parseInt(month) - 1]
                  })
                  console.log(getMonth[0])
                  var selectedGame = getMonth[0].mscd.g.filter(function(item){
                    return item.h.ta === 'WAS' || item.v.ta === 'WAS'
                  })
                  console.log(selectedGame)
                  console.log(day)
                  var filteredGame = selectedGame.filter(function(game){
                    return game.gdte.split('-')[2] === day
                  })
                  console.log(filteredGame)

                  $('.loading').hide()
                  $('.tweetButton').hide()
                  $('.scoreboard').show()
                  $('.hidden').show()
                  $('select').empty()
                  $('body').css('background', backgroundColor)

                  if (filteredGame[0].h.ta === 'WAS' && parseInt(filteredGame[0].h.s) < parseInt(filteredGame[0].v.s)) {
                          if (filteredGame[0].ptsls.pl.length > 0) {
                          var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${filteredGame[0].h.tn} lost to the
                          ${filteredGame[0].v.tn} on ${month}/${day}/${year} in ${filteredGame[0].ac}. ${filteredGame[0].ptsls.pl[0].fn} ${filteredGame[0].ptsls.pl[0].ln} led all scorers
                          with ${filteredGame[0].ptsls.pl[0].val} points. The Wizards went to ${filteredGame[0].h.re} on the season.</h1>`
                          $('.wall').hide()
                          $('.text').empty()
                          $('.homeTeamName').empty()
                          $('.awayTeamName').empty()
                          $('.homeTeamScore').empty()
                          $('.awayTeamScore').empty()
                          $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                          $('#sadWall').show()
                        } else {
                          var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${filteredGame[0].h.tn} lost to the
                          ${filteredGame[0].v.tn} on ${month}/${day}/${year} in ${filteredGame[0].ac}. The Wizards went to ${filteredGame[0].h.re} on the season.</h1>`
                          $('.wall').hide()
                          $('.text').empty()
                          $('.homeTeamName').empty()
                          $('.awayTeamName').empty()
                          $('.homeTeamScore').empty()
                          $('.awayTeamScore').empty()
                          $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                          $('#sadWall').show()
                        }
                  } else if (filteredGame[0].v.ta === 'WAS' && parseInt(filteredGame[0].v.s) < parseInt(filteredGame[0].h.s)){
                        if (filteredGame[0].ptsls.pl.length > 0) {
                            var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${filteredGame[0].v.tn} lost to the ${filteredGame[0].h.tn}
                            on ${month}/${day}/${year} in ${filteredGame[0].ac}. ${filteredGame[0].ptsls.pl[0].fn} ${filteredGame[0].ptsls.pl[0].ln} led all scorers
                            with ${filteredGame[0].ptsls.pl[0].val} points. The Wizards went to ${filteredGame[0].v.re} on the season.</h1>`
                            $('.wall').hide()
                            $('.text').empty()
                            $('.homeTeamName').empty()
                            $('.awayTeamName').empty()
                            $('.homeTeamScore').empty()
                            $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#sadWall').show()
                          } else {
                            var text = `<h1 class="summary"><span class="nope">Nope.</span> The ${filteredGame[0].v.tn} lost to the ${filteredGame[0].h.tn}
                            on ${month}/${day}/${year} in ${filteredGame[0].ac}. The Wizards went to ${filteredGame[0].v.re} on the season.</h1>`
                            $('.wall').hide()
                            $('.text').empty()
                            $('.homeTeamName').empty()
                            $('.awayTeamName').empty()
                            $('.homeTeamScore').empty()
                            $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#sadWall').show()
                          }
                  } else if (filteredGame[0].h.ta === 'WAS' && parseInt(filteredGame[0].h.s) > parseInt(filteredGame[0].v.s)) {
                        if (filteredGame[0].ptsls.pl.length > 0) {
                            var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${filteredGame[0].h.tn} beat the ${filteredGame[0].v.tn} on ${month}/${day}/${year}
                            in ${filteredGame[0].ac}. ${filteredGame[0].ptsls.pl[0].fn} ${filteredGame[0].ptsls.pl[0].ln} led all scorers with ${filteredGame[0].ptsls.pl[0].val}
                            points. The Wizards went to ${filteredGame[0].h.re} on the season.</h1>`
                            $('.wall').hide()
                            $('.text').empty()
                            $('.homeTeamName').empty()
                            $('.awayTeamName').empty()
                            $('.homeTeamScore').empty()
                            $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#happyWall').show()
                          } else {
                            var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${filteredGame[0].h.tn} beat the ${filteredGame[0].v.tn} on ${month}/${day}/${year}
                            in ${filteredGame[0].ac}. The Wizards went to ${filteredGame[0].h.re} on the season.</h1>`
                            $('.wall').hide()
                            $('.text').empty()
                            $('.homeTeamName').empty()
                            $('.awayTeamName').empty()
                            $('.homeTeamScore').empty()
                            $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#happyWall').show()
                          }
                  } else if (filteredGame[0].v.ta === 'WAS' && parseInt(filteredGame[0].v.s) > parseInt(filteredGame[0].h.s)){
                        if (filteredGame[0].ptsls.pl.length > 0) {
                            var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${filteredGame[0].v.tn} beat the ${filteredGame[0].h.tn} on ${month}/${day}/${year} in ${filteredGame[0].ac}.
                             ${filteredGame[0].ptsls.pl[0].fn} ${filteredGame[0].ptsls.pl[0].ln} led all scorers with ${filteredGame[0].ptsls.pl[0].val} points. The Wizards went to ${filteredGame[0].v.re} on the season.</h1>`
                             $('.wall').hide()
                             $('.text').empty()
                             $('.homeTeamName').empty()
                             $('.awayTeamName').empty()
                             $('.homeTeamScore').empty()
                             $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#happyWall').show()
                          } else {
                            var text = `<h1 class="summary"><span class="nope">Yep!</span> The ${filteredGame[0].v.tn} beat the ${filteredGame[0].h.tn} on ${month}/${day}/${year} in ${filteredGame[0].ac}.
                            The Wizards went to ${filteredGame[0].v.re} on the season.</h1>`
                            $('.wall').hide()
                            $('.text').empty()
                            $('.homeTeamName').empty()
                            $('.awayTeamName').empty()
                            $('.homeTeamScore').empty()
                            $('.awayTeamScore').empty()
                            $(text).hide().appendTo('.text').delay(200).fadeIn(1000)
                            $('#happyWall').show()
                          }
                  }

                  $('.homeTeamName').append(`${filteredGame[0].h.ta}`)
                  $('.awayTeamName').append(`${filteredGame[0].v.ta}`)

                  $('.homeTeamScore').append(`<h1><span id="homeScore">00</span></h1>`)
                  $('.awayTeamScore').append(`<h1><span id="visitingScore">00</span></h1>`)

                  $('.home').delay(400).fadeIn(1000)
                  $('.away').delay(400).fadeIn(1000)

                  $('#homeScore').delay(1000).animateNumber({ number: parseInt(filteredGame[0].h.s)})
                  $('#visitingScore').delay(1000).animateNumber({ number: parseInt(filteredGame[0].v.s)})

                  $('.homebtn').delay(1000).fadeIn(1000)

                  $('.tweetButton').empty()
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

                  $('.boxScore').delay(500).fadeIn(1000)

                  $('.tweetButton').delay(500).fadeIn(1000)

                  $('.homebtn').delay(2000).fadeIn(1000)

                  $('.boxScore').click(function(){
                    $('.tweetButton').hide()
                    $('.scoreboard').hide()
                    $('.hidden').hide()
                    $('body').css('background', 'white')
                    getBox()
                  })

                  function getBox() {
                    var url5 = `https://cors-anywhere.herokuapp.com/http://data.nba.net/data/10s/prod/v1/${year}${month}${day}/${filteredGame[0].gid}_boxscore.json`
                    $.ajax({
                      url: url5,
                      type: 'get',
                      dataType: 'json',
                      beforeSend: function(){
                        $('.loading').show()
                      }
                    }).done((response) => {

                      console.log(response)

                      $('.homeTeamTri').append(`<td colspan="7" class="colspan" data-neon="basic"><h2>${response.basicGameData.hTeam.triCode}</h2></td>`)
                      $('.awayTeamTri').append(`<td colspan="7" class="colspan" data-neon="basic"><h2>${response.basicGameData.vTeam.triCode}</h2></td>`)

                      var quarters = [`<th></th>`]
                      for (b = 0; b < response.basicGameData.hTeam.linescore.length; b++){
                        quarters.push(`<th data-neon="basic">Q${parseInt(b) + 1}</th>`)
                      }
                      quarters.push(`<th data-neon="basic">TOT</th>`)

                      for (a = 0; a < quarters.length; a++) {
                        $('.row').append(quarters[a])
                      }

                      var homeQuarts = [`<td data-neon="basic" class="name">${response.basicGameData.hTeam.triCode}</td>`]
                      for (e = 0; e < response.basicGameData.hTeam.linescore.length; e++){
                        homeQuarts.push(`<td>${response.basicGameData.hTeam.linescore[e].score}</td>`)
                      }
                      homeQuarts.push(`<td>${response.basicGameData.hTeam.score}</td>`)

                      var visitQuarts = [`<td data-neon="basic" class="name">${response.basicGameData.vTeam.triCode}</td>`]
                      for (f = 0; f < response.basicGameData.vTeam.linescore.length; f++){
                        visitQuarts.push(`<td>${response.basicGameData.vTeam.linescore[f].score}</td>`)
                      }
                      visitQuarts.push(`<td>${response.basicGameData.vTeam.score}</td>`)


                      for (g = 0; g < homeQuarts.length; g++){
                        $('.hQuarts').append(homeQuarts[g])
                        $('.vQuarts').append(visitQuarts[g])
                      }



                      var wizIsHome
                      var wizIsAway

                      if (response.basicGameData.hTeam.triCode === 'WAS'){
                        var wizIsHome = true
                      } else {
                        wizIsHome = false
                      }

                      $('.statText').append(`<p>Game was on ${month}/${day}/${year} in ${response.basicGameData.arena.city}...
                        ${response.basicGameData.nugget.text}...Game lasted ${response.basicGameData.gameDuration.hours}
                        hours and ${response.basicGameData.gameDuration.minutes} minutes...There were ${response.stats.leadChanges} lead changes and
                        ${response.stats.timesTied} ties...`)


                      var players = response.stats.activePlayers

                      var wizardsPlayers = []
                      var otherPlayers = []

                      // function getPlayers(){
                            var url6 = `https://cors-anywhere.herokuapp.com/http://data.nba.net/data/10s/prod/v1/2017/players.json`

                            $.ajax({
                              url: url6,
                              type: 'get',
                              dataType: 'json'
                            }).done((response) => {
                              // players.sort(function(a, b){
                              //   return b.points - a.points
                              // })
                              for (j = 0; j < response.league.standard.length; j++){
                                for (i = 0; i < players.length; i++){
                                  if (players[i].personId === response.league.standard[j].personId && players[i].teamId === '1610612764') {
                                    // console.log(players)
                                    wizardsPlayers.push(`<tr><td>${response.league.standard[j].firstName} ${response.league.standard[j].lastName}</td>
                                      <td>${players[i].points}</td><td>${players[i].assists}</td><td>${players[i].totReb}</td><td>${players[i].blocks}</td>
                                      <td>${players[i].steals}</td><td>${players[i].min}</td></tr>`)
                                  } else if (players[i].personId === response.league.standard[j].personId) {
                                    otherPlayers.push(`<tr><td>${response.league.standard[j].firstName} ${response.league.standard[j].lastName}</td>
                                      <td>${players[i].points}</td><td>${players[i].assists}</td><td>${players[i].totReb}</td><td>${players[i].blocks}</td>
                                      <td>${players[i].steals}</td><td>${players[i].min}</td></tr>`)
                                  }
                                }
                              }
                              if (wizIsHome === true) {
                                for (d = 0; d < wizardsPlayers.length; d++){
                                  $('.homeTable').append(wizardsPlayers[d])
                                }
                                  for (c = 0; c < otherPlayers.length; c++){
                                    $('.awayTable').append(otherPlayers[c])
                                  }
                              } else {
                                for (d = 0; d < wizardsPlayers.length; d++){
                                  $('.awayTable').append(wizardsPlayers[d])
                                }
                                  for (c = 0; c < otherPlayers.length; c++){
                                    $('.homeTable').append(otherPlayers[c])
                                  }
                                }

                            })
                        // }
                        console.log(wizardsPlayers)
                        console.log(otherPlayers)
                        // getPlayers()
                        $('.loading').hide()
                        $('body').css('background', backgroundColor)
                        // $('.box').css('visibility', 'visible')
                        $('.boxx').show()
                        $('.statText').fadeIn(300)
                        $('.quarters').delay(600).fadeIn(1000)
                        $('.homeTable').delay(600).fadeIn(1000)
                        $('.awayTable').delay(600).fadeIn(1000)
                        $('.homeFromBox').delay(1000).fadeIn(1000)

                      })
                    }
                })




          })
        }
