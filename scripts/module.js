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


Hooks.once("ready", async () => {
  if (!game.user.isGM) return; // только для ГМа

  // Проверяем, есть ли уже макрос с таким именем
  let macroName = "Нужные макросы";
  let macro = game.macros.find(m => m.name === macroName);

  if (!macro) {
    // Создаем новый макрос
    macro = await Macro.create({
      name: macroName,
      type: "script",
      scope: "global",
      img: "icons/commodities/tech/cog-brass.webp",
      command: `
//ВИДИМОСТЬ ТАЙЛОВ
const updates = [];
let tile = canvas.tiles.get("TILE-ID");
if (tile.document.hidden==false){
    updates.push({
       _id:tile.id,
       hidden:true
    });
} else {
    updates.push({
       _id:tile.id,
       hidden:false
    });
}
canvas.scene.updateEmbeddedDocuments("Tile", updates);

// ЗАПУСК МУЗЫКИ ИЗ ПЛЕЙЛИСТА
const playlistName = "ПЛЕЙЛИСТ";          // Имя плейлиста
const trackName = "ТРЕК";       // Имя трека
const fadeDuration = 3000;                 // Время затухания/нарастания в мс
const maxVolume = 1.0;                     // Максимальная громкость (0..1)
// --- КОНЕЦ НАСТРОЕК ---
const playlist = game.playlists.getName(playlistName);
const sound = playlist.sounds.getName(trackName);
if(sound.playing){ await playlist.stopSound(sound);
                 }else{ await playlist.playSound(sound);}

// ЗАПУСК ЗВУКА ОТДЕЛЬНО
new Sequence()
    .sound("ПУТЬ К ФАЙЛУ.mp3")
    .audioChannel("environment")  
    .forUsers("ЛОГИН_ИГРОКА")     
    .forUsers("ЛОГИН_МАСТЕРА")    
    .play()
`
    });

    ui.notifications.info("Нужные макросы созданы и добавлены в панель макросов.");
  }

  // Кладем макрос в слот 1 хотбара ГМа
  if (!game.user.hotbar) return;
  if (!game.user.hotbar[1]) {
    await game.user.assignHotbarMacro(macro, 1);
  }
});