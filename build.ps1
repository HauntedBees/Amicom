cat js\script.js,js\game.js,js\settings.js,js\menu.js,js\dialog.js,js\pet.js,js\farmGame.js,js\sportsGame.js,js\cupGame.js,js\caveGame.js | sc petFull.js
java -jar yuicompressor-2.4.8.jar petFull.js -o petFull.min.js
java -jar yuicompressor-2.4.8.jar css\style.css -o style.min.css
del petFull.js