// Import TypeScript modules
import { registerSettings } from './lib/settings.js';
import { TenCandles } from './lib/TenCandles.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('Ten Candles | Initializing');
    // Assign custom classes and constants here

    // Register custom module settings
    registerSettings();
    // Preload Handlebars templates
    // await preloadTemplates();
    // Register custom sheets (if any)
});
let operations;

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    // Do anything after initialization but before ready
      operations = {
        startTimer: TenCandles.startTimer,
        interact: TenCandles.interact,
        isCandleLit: TenCandles.isCandleLit,
        countLitCandles: TenCandles.countLitCandles,
        candlesSceneUUID: TenCandles.candlesSceneUUID,
        candlesUUIDs: TenCandles.candlesUUIDs,
        bowlUUIDs: TenCandles.bowlUUIDs,
        playerDiceCountTextUUID: TenCandles.playerDiceCountTextUUID,
        gmDiceCountTextUUID: TenCandles.gmDiceCountTextUUID,
        roll: TenCandles.roll,
        rollGM: TenCandles.rollGM,
        rollPlayer: TenCandles.rollPlayer,
        isCandlesScene: TenCandles.isCandlesScene,
        removePlayerDice: TenCandles.removePlayerDice,
        resetPlayerDice: TenCandles.resetPlayerDice,
        updateDarkness: TenCandles.updateDarkness,
        getCandleTimer: TenCandles.getCandleTimer,
        resetCandleTimer: TenCandles.resetCandleTimer,
        saveCandleTimer: TenCandles.saveCandleTimer
      };

      //@ts-ignore
      game.candles = operations;
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {

  //@ts-ignore
  if (game.modules.get("foundryvtt-simple-calendar").active) {
    //@ts-ignore
  } else console.warn("simple calendar not loaded");

    // emergency clearing of the queue ElapsedTime._flushQueue();
    TenCandles.init();
    // Do this until simple calendar is ready early
});

Hooks.on("renderChatMessage", function (message, html, data) {
  // Check if the message is a roll
  if (message.isRoll && game.user.isGM) {
    if (!message.getFlag('oxy949-ten-candles', `clicked-${message.id}`)) {
        html.find(`button#reduce-dice`).click(async () => {
            
            const failuresValue = html.find(`button#reduce-dice`).data('failures');
            game.candles.removePlayerDice(failuresValue)

            html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
            await message.setFlag('oxy949-ten-candles', `clicked-${message.id}`, true);  // Уникальный флаг для конкретного сообщения
        });
    }else{
      html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
    }
  }else{
    html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
  }
  
});