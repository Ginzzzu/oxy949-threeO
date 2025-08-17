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
        useCharm: ThreeO.useCharm
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

/* ------------------------------------ */
/* Создаем библиотеку и макрос						*/
/* ------------------------------------ */
Hooks.once("ready", async () => {
  const pack = game.packs.get("oxy949-threeO.macros");
  if (!pack) {
    console.error("❌ Не найден компендий oxy949-threeO.macros");
    return;
  }

  // Загружаем содержимое компендия
  await pack.getDocuments();
  let existing = pack.index.find(e => e.name === "Действовать!");
  if (existing) return; // Уже есть

  console.log("➕ Добавляем макрос 'Действовать!' в компендий...");

  const macroData = {
    name: "Действовать!",
    type: "script",
    img: "icons/magic/control/silhouette-hold-change-green.webp",
    command: `const character1 = game.user.character;

new Dialog({
  title: "ВРЕМЯ ДЕЙСТВОВАТЬ!",
  content:\`
<p>
  <select id="actionType" style="width: 100%;">
    <option value="normal">Действую самостоятельно</option>
    <option value="easy">Есть преимущество: кто-то или что-то помогает</option>
    <option value="hard">Есть помеха: кто-то или что-то мешает</option>
  </select>
</p>
\`,
  buttons: {
    option1: {
      label: "Осторожно",
      callback: (html) => {
        const actionType = html.find("#actionType").val();
        game.threeO.roll(1, actionType )
      }
    },
    option2: {
      label: "Обычно",
      callback: (html) => {
        const actionType = html.find("#actionType").val();
        game.threeO.roll(2, actionType )
      }
    },
    option3: {
      label: "Опасно",
      callback: (html) => {
        const actionType = html.find("#actionType").val();
        game.threeO.roll(3, actionType )
      }
    }
  },
  default: "option2"
}).render(true);`
  };

  await Macro.create(macroData, { pack: pack.collection });
  console.log("✅ Макрос 'Действовать!' создан в компендии ThreeO Macros");
});

/*
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
  */