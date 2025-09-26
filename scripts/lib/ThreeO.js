export class ThreeO {
    static async init() {}
  
static async roll(diceCount, modifier = 'normal', actorId = null) {
  const modulename = "oxy949-threeO";
  const zeroMode = game.settings.get(modulename, "zeroMode");

  // Находим актёра — если передали actorId, используем его, иначе привязанный к пользователю персонаж
  const actor = actorId ? game.actors.get(actorId) : game.user.character;
  if (!actor) {
    ui.notifications.error("У вас нет привязанного персонажа!");
    return;
  }

  // Текущее HP (рассудок)
  const currentHP = actor.system.attributes?.hp?.value ?? 0;

  // 🔹 Сохраняем snapshot HP и параметры броска в флаг актёра для возможного реролла
  await actor.setFlag(modulename, "lastRoll", {
    value: diceCount,
    type: modifier,
    actorId: actor.id,
    prevHP: currentHP,
    timestamp: Date.now()
  });

  // Проверяем только если zeroMode выключен
  if (!zeroMode && currentHP <= 0) {
    ui.notifications.error("У вас нет ресурса!");
    return;
  }

  const easyMode = game.settings.get(modulename, "easyModeLyghtburg");

  let successes = 0;
  let empty = 0;
  let failures = 0;

  // Генерация броска
  const roll = await new Roll(`${diceCount}df`).evaluate();

  roll.terms[0].results.forEach(r => {
    if (r.result === -1) failures += 1;
    if (r.result === 0) empty += 1;
    if (r.result === 1) successes += 1;
  });

  // Формирование текста сообщения
  let rollMessage = "<p>";
  let rollDiceText = "Действует как обычно, ";

  if (diceCount === 1) {
    rollDiceText = "Действует осторожно, ";
  } else if (diceCount === 3) {
    rollDiceText = "Действует опасно, ";
  }

  let rollTypeText = "самостоятельно";
  if (modifier === 'hard') rollTypeText = "но что-то мешает";
  else if (modifier === 'easy') rollTypeText = "но что-то помогает";

  rollMessage += `<strong style="font-size: large;">${rollDiceText} ${rollTypeText}</strong><br>`;
  rollMessage += "</p>";

  let resourceRemoved = 0;
  let totalResult = 0;

  if (easyMode) {
    if (modifier === 'normal') {
      resourceRemoved = failures + empty - successes;
      totalResult = successes - failures;
    } else if (modifier === 'hard') {
      resourceRemoved = failures + empty - successes;
      totalResult = successes - failures - empty;
    } else if (modifier === 'easy') {
      resourceRemoved = failures - successes;
      totalResult = successes - failures + empty;
    }
  } else {
    if (modifier === 'normal') {
      resourceRemoved = failures + empty;
      totalResult = successes - failures;
    } else if (modifier === 'hard') {
      resourceRemoved = failures + empty;
      totalResult = successes - failures - empty;
    } else if (modifier === 'easy') {
      resourceRemoved = failures;
      totalResult = successes - failures + empty;
    }
  }

  const resourceName = game.settings.get(modulename, "resourceName");

  let statsMessage = "";
  if (resourceRemoved > 0 && currentHP != 0) {
    statsMessage += `<strong style="color: red;">Потеря ${resourceName}: ${resourceRemoved}<br></strong>`;
  } else if (resourceRemoved < 0) {
    statsMessage += `<strong style="color: green;">Восстановление ${resourceName}: ${Math.abs(resourceRemoved)}<br></strong>`;
  } else {
    statsMessage += `<strong style="color: grey;">Состояние не изменилось<br></strong>`;
  }

  statsMessage += `<strong style="font-size: medium;">Успешность: ${totalResult}</strong>`;

  if (!zeroMode && currentHP <= resourceRemoved) {
    statsMessage += `<br><strong style="font-size: large;">Недостаточно ресурса, потеря сознания!</strong>`;
  }

  const flavor = `${rollMessage}${statsMessage}`;
  const speaker = ChatMessage.getSpeaker({ actor: actor });

  // Сообщение в чат и анимация кубиков
  await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });

  // После завершения анимации — применяем урон/лечение (applyDamage корректно работает в вашей системе)
  Hooks.once("diceSoNiceRollComplete", () => {
    setTimeout(() => {
      actor.applyDamage(resourceRemoved);
    }, 500);
  });
}

  
    static async useCharm(diceCount) {
    const character = game.user.character;

  
      if (!character) {
        ui.notifications.error("У вас нет привязанного персонажа!");
        return;
      }
  
      const currentHP = character.system.attributes.hp.value;
  
      if (currentHP <= 0) {
        ui.notifications.error("У вас нет ресурса!");
        return;
      }
  
      const modulename = "oxy949-threeO";
      const itemName = "Талисман";
  
      const item = character.items.find(i => i.name === itemName && i.type === "consumable");
  
      if (!item) {
        ui.notifications.warn(`Предмет "${itemName}" не найден.`);
        return;
      }
  
      const qty = item.system.quantity;
  
      if (qty < 1) {
        ui.notifications.warn(`У вас нет зарядов "${itemName}".`);
        return;
      }
  
      // Генерация броска
      let successes = 0;
      let empty = 0;
      let failures = 0;
  
      //const roll = await new Roll(`${diceCount}df`).evaluate({ async: true });
      const roll = await new Roll(`${diceCount}df`).evaluate(); 

  
      roll.terms[0].results.forEach(r => {
        if (r.result === -1) failures += 1;
        if (r.result === 0) empty += 1;
        if (r.result === 1) successes += 1;
      });
  
      // Формирование текста сообщения
      let rollMessage = "<p>";
      let rollDiceText = "Смотрит на талисман...";
  
      if (diceCount === 1) {
        rollDiceText = "Осторожно дотрагивается до талисмана...";
      } else if (diceCount === 3) {
        rollDiceText = "Сжимает талисман изо всех сил!...";
      }

      rollMessage += `<strong style="font-size: large; color: purple;">${rollDiceText}</strong><br>`;
      if (failures === 3 ){
      rollMessage += `<strong style="font-size: large; color: red;">О, НЕТ!!!...</strong><br>`;
      } else if (successes === 3 ){
      rollMessage += `<strong style="font-size: large; color: green;">О, ДААА!!!...</strong><br>`;
      } else {
        if (qty - failures > 0) {
        //  rollMessage += `<strong style="font-size: small;">Осталось зарядов талисмана:${qty - failures}</strong><br>`;
        }
        else {
          rollMessage += `<strong style="font-size: large; color: red;">Но больше он не поможет...</strong><br>`;
        }
      }
      rollMessage += "</p>";
  
      let totalResult = (successes + empty) * 2;
      let resourceName = game.settings.get(modulename, "resourceName");

      if (failures >= qty){
        totalResult = totalResult * 0.5;
      }
      if (failures === 3){
        totalResult = -10;
      }
      if (successes === 3){
        totalResult = 10;
      }
  
      let statsMessage = `<strong style="color: green;">Восстановление ${resourceName}: ${totalResult}<br></strong>`;
      if (failures >= qty) {        
        if (currentHP <= -totalResult) {
            statsMessage = `<strong style="font-size: large;">Недостаточно ресурса, потеря сознания!</strong>`;
        }
      }
      // Формируем html-код сообщения в чате. Добавляем изображение слева.
      const messageHtml = `
        <div style="display: flex; align-items: flex-start;">
          <img src="${item.img}" alt="${itemName}" style="width:60px; height:60px; border-width: 0; margin-right:10px;" />
          <div>
            ${rollMessage}${statsMessage}
          </div>
        </div>
      `;

      const flavor = messageHtml;
      const speaker = ChatMessage.getSpeaker({ actor: character });
  
      await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });
  
      Hooks.once("diceSoNiceRollComplete", async () => {
        setTimeout(async () => {
          character.applyDamage(-totalResult);
  
          if (failures < qty) {
            await item.update({ "system.quantity": qty - failures });
            //ui.notifications.info(`"${itemName}" осталось ${qty - failures} заряд(а).`);
          } else {
            await item.delete();
            character.applyDamage(failures - qty);
            //ui.notifications.info(`"${itemName}" использован полностью и удалён.`);
          }
        }, 500);
      });
    }
  }
  
  
  //Активируем кастомный чарник персонажа игрока
class ThreeOActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["threeO", "sheet", "actor"],
      template: "modules/oxy949-threeO/templates/actor-sheet.html",
      width: 1060,
      height: 610,
      submitOnChange: true   // теперь изменения сохраняются при blur    
        
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system ?? {};

    const modulename = "oxy949-threeO";
    context.resourceName = game.settings.get(modulename, "resourceName");
    context.inspName = game.settings.get(modulename, "inspName");    
    context.inspSound = game.settings.get(modulename, "inspSound");        
    context.actionList = game.settings.get(modulename, "actionList");
    context.resourceShow = game.settings.get(modulename, "resourceShow");
    context.itemsName = game.settings.get(modulename, "itemsName"); 
    context.charInfoName = game.settings.get(modulename, "charInfoName");     
    context.additionalInfo1 = this.actor.getFlag(modulename, "additionalInfo1") ?? "";
    context.additionalInfoCharacter =  this.actor.getFlag(modulename, "additionalInfoCharacter") ?? "";    
    context.additionalInfo2 = this.actor.getFlag(modulename, "additionalInfo2") ?? "";
    context.additionalInfo3 = this.actor.getFlag(modulename, "additionalInfo3") ?? "";  
    context.gmNotes = this.actor.getFlag("oxy949-threeO", "gmNotes") ?? "";             
    context.isGM = game.user.isGM;
    context.inspiration = this.actor.getFlag("oxy949-threeO", "inspiration") ?? 0;
    context.inspirationChecks = [1, 2, 3, 4, 5];

Hooks.once("ready", function() {
  // Если объекта ещё нет
  if (!game.threeO) game.threeO = {};

  // Функция броска
  game.threeO.roll = async function(actionValue, actionType, actorId=null) {
    // сам бросок
    const roll = await new Roll("1d20").roll({async:true});
    roll.toMessage({flavor: `Бросок (${actionType}), сложность ${actionValue}`});

    // Находим актёра
    let actor = actorId ? game.actors.get(actorId) : game.user.character;
    if (!actor) return;

    // Пример изменения ресурса (hp = "рассудок")
    let hp = foundry.utils.duplicate(actor.system.attributes.hp);
    hp.value = Math.max(0, Math.min(hp.max, hp.value - actionValue));
    await actor.update({"system.attributes.hp": hp});
  
    const currentHP = character.system.attributes.hp.value;
    // Сохраняем предыдущее значение HP для возможного отката "Овацией"
    game.threeO = game.threeO || {};
    game.threeO.lastHP = currentHP;    
  };
});
    // cover.jpg
    const coverPath = `worlds/${game.world.id}/cover.jpg`;
    try { await fetch(coverPath, { method: "HEAD" }); context.cover = coverPath; }
    catch { context.cover = null; }

    // ----- ИНВЕНТАРЬ -----
    let inv = this.actor.getFlag(modulename, "inventory") ?? [];
    const minRows = game.settings.get(modulename, "minInventoryRows") ?? 3;
    if (inv.length < minRows) {
      inv = Array.from({ length: minRows }, (_, i) => inv[i] ?? "");
      await this.actor.setFlag(modulename, "inventory", inv);
    }
    context.inventory = inv;
    context.invFlagPath = `flags.${modulename}.inventory`;

    // Доп. информация
    context.additionalInfo = this.actor.getFlag(modulename, "additionalInfo") ?? "";

    return context;
  }

  activateListeners(html) {
  super.activateListeners(html);
  const modulename = "oxy949-threeO";

  // ------------------------
  // Кнопка смены токена в чарнике
  // ------------------------
  html.find(".change-token-btn").on("click", async ev => {
    ev.preventDefault();

    const fp = new FilePicker({
      type: "image",
      current: this.actor.prototypeToken.texture.src,
      callback: async (path) => {
        await this.actor.update({ "prototypeToken.texture.src": path });
        ui.notifications.info("Токен изменён.");
      },
      top: this.position.top + 40,
      left: this.position.left + 10
    });
    fp.render(true);
  });

  // ------------------------
  // Обработчик кнопок действий (бросок)
  // ------------------------
  html.on("click", ".action-option", async ev => {
    ev.preventDefault();

    const button = ev.currentTarget;
    const actionValue = Number(button.dataset.value); // 1,2,3
    const actionType = html.find("#actionType").val();

    if (!ThreeO?.roll) {
      ui.notifications.error("Система действий не инициализирована.");
      return;
    }

    // Сохранять lastRoll флаг не обязательно здесь — ThreeO.roll делает это — но можно дополнительно:
    // await this.actor.setFlag(modulename, "lastRoll", { value: actionValue, type: actionType, actorId: this.actor.id, prevHP: this.actor.system.attributes.hp.value });

    // Вызов броска для данного актёра (ThreeO.roll сохранит prevHP)
    await ThreeO.roll(actionValue, actionType, this.actor.id);
  });

  // ------------------------
  // Игроки могут кликать галочки "Овации"
  // ------------------------
// Звук овации
const sound = game.settings.get("oxy949-threeO", "inspSound");
const volume = game.settings.get("oxy949-threeO", "inspVolume");
  // используем делегированное 'change' событие
  html.on("change", ".insp-check", async ev => {
    const idx = Number(ev.currentTarget.dataset.index);
    const isChecked = ev.currentTarget.checked;

    let current = this.actor.getFlag(modulename, "inspiration") ?? 0;

    // только когда игрок СНИМАЕТ (т.е. перевёл чек в false) последнюю галочку
    if (!isChecked && idx === current) {
 // звук при использовании
if (sound) {
  AudioHelper.play({ src: sound, volume, autoplay: true, loop: false }, true);
} 
      // уменьшаем счётчик оваций у актёра (флаг)
      await this.actor.setFlag(modulename, "inspiration", current - 1);

      // получаем lastRoll из флага актёра
      const lastRoll = this.actor.getFlag(modulename, "lastRoll");
      if (!lastRoll) {
        ui.notifications.warn("Нет предыдущего броска для повторения.");
        return;
      }

      // проверьте, что lastRoll принадлежит этому актёру (защита)
      if (lastRoll.actorId && lastRoll.actorId !== this.actor.id) {
        ui.notifications.warn("Последний бросок не принадлежит этому персонажу.");
        return;
      }

      // откатываем HP к сохранённому prevHP (await — важно)
      if (lastRoll.prevHP !== undefined) {
        await this.actor.update({ "system.attributes.hp.value": lastRoll.prevHP });
        // (не обязателен) можно обновить UI: await this.render(false);
      }

      // пишем в чат что используется овация
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<p>🎭 <strong style="font-size: medium; color: #005e37ff;">${this.actor.name}</strong> использует силу 👏${game.settings.get(modulename, "inspName")}👏 чтобы <strong style="font-size: medium; color: #005e37ff;">уйти от судьбы!</strong></p>`
      });

      // Наконец — повторный бросок (он снова сохранит новый lastRoll)
      await ThreeO.roll(lastRoll.value, lastRoll.type, this.actor.id);
    } else {
      // если игрок пытается поставить галочку или трогает не последнюю — просто перерисовать лист (чтобы синхронизировать вид)
      this.render();
    }
  });

  // ------------------------
  // Вкладки (Notes)
  // ------------------------
  const TabsCls = foundry?.applications?.api?.Tabs ?? window.Tabs;

  this._tabs = this._tabs || {};
  this._tabs.notes = new TabsCls({
    navSelector: ".sheet-tabs",
    contentSelector: ".additional-info-section",
    initial: "note1"
  });
  this._tabs.notes.bind(html[0]);

  // ------------------------
  // Инвентарь: добавить / удалить / drag&drop
  // ------------------------
  html.on("click", ".inventory-add", async (ev) => {
    ev.preventDefault();
    const inv = [];
    html.find("input[name^='flags." + modulename + ".inventory.']").each((i, el) => {
      inv.push(el.value);
    });
    inv.push("");
    await this.actor.setFlag(modulename, "inventory", inv);
    this.render();
  });

  html.on("click", ".inventory-remove", async (ev) => {
    ev.preventDefault();
    const idx = Number(ev.currentTarget.dataset.index);
    const inv = [];
    html.find("input[name^='flags." + modulename + ".inventory.']").each((i, el) => {
      inv.push(el.value);
    });
    if (inv.length > 1 && idx >= 0 && idx < inv.length) inv.splice(idx, 1);
    await this.actor.setFlag(modulename, "inventory", inv);
    this.render();
  });

  let dragSrcIndex = null;
  html.find(".drag-handle").on("dragstart", (ev) => {
    const row = ev.currentTarget.closest(".inventory-row");
    dragSrcIndex = Number(row.dataset.index);
    ev.originalEvent.dataTransfer.effectAllowed = "move";
  });

  html.find(".inventory-row").on("dragover", (ev) => {
    ev.preventDefault();
    ev.originalEvent.dataTransfer.dropEffect = "move";
  });

  html.find(".inventory-row").on("drop", async (ev) => {
    ev.preventDefault();
    const dropIndex = Number(ev.currentTarget.dataset.index);
    if (dragSrcIndex === null || dropIndex === dragSrcIndex) return;

    const inv = [];
    html.find("input[name^='flags." + modulename + ".inventory.']").each((i, el) => {
      inv.push(el.value);
    });

    const [moved] = inv.splice(dragSrcIndex, 1);
    inv.splice(dropIndex, 0, moved);

    await this.actor.setFlag(modulename, "inventory", inv);
    this.render(false);
    dragSrcIndex = null;
  });
}


  /** Сохраняем инвентарь, доп. информацию и все system.* поля */
  async _updateObject(event, formData) {
    const modulename = "oxy949-threeO";

    // --- сохраняем инвентарь ---
    const inv = Object.keys(formData)
      .filter(k => k.startsWith(`flags.${modulename}.inventory.`))
      .sort()
      .map(k => formData[k]);
    await this.actor.setFlag(modulename, "inventory", inv);

    // --- сохраняем доп. информацию ---
    const addKey = `flags.${modulename}.additionalInfo`;
    if (formData[addKey] !== undefined) {
      await this.actor.setFlag(modulename, "additionalInfo", formData[addKey]);
    }
   // --- сохраняем черты характера ---
const charKey = `flags.${modulename}.additionalInfoCharacter`;
if (formData[charKey] !== undefined) {
  await this.actor.setFlag(modulename, "additionalInfoCharacter", formData[charKey]);
}    

  // --- сохраняем всё остальное (имя, HP, system.* и т.п.) ---
const updateDataFlat = {};
for (const [k, v] of Object.entries(formData)) {
  if (k.startsWith(`flags.${modulename}.inventory.`)) continue;
  if (k === addKey) continue;
  updateDataFlat[k] = v;
}
if (Object.keys(updateDataFlat).length) {
  const updateData = foundry.utils.expandObject(updateDataFlat);

  // Проверяем изменение оваций
  const newInsp = getProperty(updateData, "flags.oxy949-threeO.inspiration");
  if (newInsp !== undefined) {
    const oldInsp = this.actor.getFlag("oxy949-threeO", "inspiration") ?? 0;
    if (newInsp > oldInsp) {
      // звук для ГМа
      const gmSound = game.settings.get("oxy949-threeO", "gmInspSound");
      const gmVolume = game.settings.get("oxy949-threeO", "gmInspVolume");
      if (gmSound) {
        AudioHelper.play({ src: gmSound, volume: gmVolume, autoplay: true, loop: false }, true);
      }

      // сообщение в чат
      ChatMessage.create({
        speaker: { alias: "👏👏👏" },
        content: `🎭 <strong style="font-size: medium; color: #7b0c50ff;">${this.actor.name}</strong> - в честь тебя звучат бурные овации! <strong style="font-size: medium; color: #7b0c50ff;">Прекрасная игра!</strong>`
      });
    }
  }

  await this.actor.update(updateData);
}

  }
}

// --- Упрощённый лист (NPC) ---
class ThreeOGMActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["threeO", "sheet", "actor", "gm"],
      template: "modules/oxy949-threeO/templates/gm-actor-sheet.html",
      width: 450,
      height: 750,
      submitOnChange: true
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    const modulename = "oxy949-threeO";

    context.isGM = game.user.isGM;
    context.gmNotes = this.actor.getFlag(modulename, "gmNotes") ?? "";
    context.resourceName = game.settings.get(modulename, "resourceName");    

    // cover.jpg
    const coverPath = `worlds/${game.world.id}/cover.jpg`;
    try { await fetch(coverPath, { method: "HEAD" }); context.cover = coverPath; }
    catch { context.cover = null; }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Кнопка смены токена
    html.find(".change-token-btn").on("click", async ev => {
      ev.preventDefault();
      const fp = new FilePicker({
        type: "image",
        current: this.actor.prototypeToken.texture.src,
        callback: async (path) => {
          await this.actor.update({ "prototypeToken.texture.src": path });
          ui.notifications.info("Токен изменён.");
        }
      });
      fp.render(true);
    });
  }
}

// --- Регистрация обоих листов ---
Hooks.once("init", function() {
  console.log("ThreeO | Регистрация кастомных бланков");

  Actors.registerSheet("threeO", ThreeOActorSheet, {
    types: ["character"],
    makeDefault: true
  });

  Actors.registerSheet("threeO", ThreeOGMActorSheet, {
    types: ["npc"],
    makeDefault: true
  });
});



