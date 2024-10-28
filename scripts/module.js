// Import TypeScript modules
import { registerSettings } from './lib/settings.js';
import { ThreeO } from './lib/ThreeO.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('ThreeO | Initializing');
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
        roll: ThreeO.roll,
      };

      //@ts-ignore
      game.threeO = operations;
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
  TenCandles.init();
});

Hooks.on("renderChatMessage", function (message, html, data) {
  // Check if the message is a roll
  if (message.isRoll && game.user.isGM) {
    if (!message.getFlag('oxy949-threeO', `clicked-${message.id}`)) {
        html.find(`button#reduce-dice`).click(async () => {
            
            const failuresValue = html.find(`button#reduce-dice`).data('failures');
            game.candles.removePlayerDice(failuresValue)

            html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
            await message.setFlag('oxy949-threeO', `clicked-${message.id}`, true);  // Уникальный флаг для конкретного сообщения
        });
    }else{
      html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
    }
  }else{
    html.find(`button#reduce-dice`).hide();  // Скрываем кнопку
  }
  
});