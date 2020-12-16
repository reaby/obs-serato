# OBS-Serato

Now playing infos from serato.

# Instructions

1. Install nodejs
2. Extract zip or clone repository to somewhere at same computer where your serato is
3. run  `npm install` at repository directory
4. after successfull install type: `npm run start:dev`
5. edit `config.json` to match your favourite colors
6. setup OBS
   1. add new browser source
   2. set URL: http://localhost:8000
      * if you run obs different machine, use the serato machine ip instead of localhost
   3. set width 1920
   4. set height 400
   5. delete everythign from custom CSS
   6. set checked: refresh browser when scene becomes active
   7. press OK
   8. then just move the browser source at editor area where you wish, you can as well scale it if needed.


# config.json

`textColors` takes arguments #RGB or #RRGGBB or html color name.

`animation` takes arguments from animate.css, see preview of effects at https://animate.style/


# Note

Now playing info is updated in delay of 1 song.
This means:
1. Deck1 load Song1
   * now playing: Song1
2. Deck2 load Song2
   * now playing: Song1
3. Deck1 load Song3 
   * now playing: Song2

So it goes in delay.

If you wish to update song as of instant, just 
press eject of non-loaded song:

1. Deck1 load Song1
   * now playing: Song1
2. Deck2 load Song2
   * Press eject on deck1
   * now playing: Song2
3. Deck1 load Song3 
   * Press eject on deck2
   * now playing: Song3

