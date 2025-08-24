export class ThreeO {
    static async init() {}
  
static async roll(diceCount, modifier = 'normal') {
  const modulename = "oxy949-threeO";
  const zeroMode = game.settings.get(modulename, "zeroMode");

  const character = game.user.character;

  if (!character) {
    ui.notifications.error("У вас нет привязанного персонажа!");
    return;
  }

  const currentHP = character.system.attributes.hp.value;

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
      //const roll = await new Roll(`${diceCount}df`).evaluate({ async: true });
      
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
  
      if (modifier === 'hard') {
        rollTypeText = "но что-то мешает";
      } else if (modifier === 'easy') {
        rollTypeText = "но что-то помогает";
      }
  
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
  
      const resourceShow = game.settings.get(modulename, "resourceShow");
      const resourceName = game.settings.get(modulename, "resourceName");
        
      let statsMessage = "";
      if (resourceRemoved > 0 && currentHP !=0) {
        statsMessage += `<strong style="color: red;">Потеря ${resourceName}: ${resourceRemoved}<br></strong>`;
      } else if (resourceRemoved < 0) {
        statsMessage += `<strong style="color: green;">Восстановление ${resourceName}: ${Math.abs(resourceRemoved)}<br></strong>`;
      } else {
        statsMessage += `<strong style="color: grey;">Состояние не изменилось<br></strong>`;
      }
  
      statsMessage += `<strong style="font-size: medium;">Успешность: ${totalResult}</strong>`;
  
        // Проверяем только если zeroMode выключен
  if (!zeroMode && currentHP <= resourceRemoved) {
        statsMessage += `<br><strong style="font-size: large;">Недостаточно ресурса, потеря сознания!</strong>`;
      }
  
      const flavor = `${rollMessage}${statsMessage}`;
      const speaker = ChatMessage.getSpeaker({ actor: character });
  
      // Сообщение в чат и автоматическая анимация кубиков
      await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });
  
      // После завершения анимации наносим урон с задержкой
      Hooks.once("diceSoNiceRollComplete", () => {
        setTimeout(() => {
          character.applyDamage(resourceRemoved);
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
      width: 980,
      height: 550,
      submitOnChange: true   // теперь изменения сохраняются при blur
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system ?? {};

    const modulename = "oxy949-threeO";
    context.resourceName = game.settings.get(modulename, "resourceName");
    context.actionList = game.settings.get(modulename, "actionList");
    context.resourceShow = game.settings.get(modulename, "resourceShow");
    context.itemsName = game.settings.get(modulename, "itemsName"); 
    context.additionalInfo1 = this.actor.getFlag(modulename, "additionalInfo1") ?? "";
    context.additionalInfo2 = this.actor.getFlag(modulename, "additionalInfo2") ?? "";
    context.additionalInfo3 = this.actor.getFlag(modulename, "additionalInfo3") ?? "";  
    context.gmNotes = this.actor.getFlag("oxy949-threeO", "gmNotes") ?? "";             
    context.isGM = game.user.isGM;

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

  // Открыть диалог выбора файла
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
  // Обработчики действий
  // ------------------------
  // Используем делегирование, чтобы работало даже если контент перерисуется
  html.on("click", ".action-option", async ev => {
    ev.preventDefault();

    const button = ev.currentTarget;
    const actionValue = Number(button.dataset.value); // 1, 2, 3
    const actionType = html.find("#actionType").val(); // выбранный тип действия

    if (!game.threeO?.roll) {
      ui.notifications.error("Система действий не инициализирована.");
      return;
    }

    game.threeO.roll(actionValue, actionType);
  });

  // ------------------------
  // Вкладки (Notes)
  // ------------------------
  // Убедимся, что Tabs берётся из актуального API Foundry
  const TabsCls = foundry?.applications?.api?.Tabs ?? window.Tabs;

  this._tabs = this._tabs || {};
  this._tabs.notes = new TabsCls({
    navSelector: ".sheet-tabs",
    contentSelector: ".additional-info-section",
    initial: "note1"
  });
  this._tabs.notes.bind(html[0]);


    // === Добавить ===
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

  // === Удалить ===
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

  // === Drag&Drop ===
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

    // --- сохраняем всё остальное (имя, HP, system.* и т.п.) ---
    const updateDataFlat = {};
    for (const [k, v] of Object.entries(formData)) {
      if (k.startsWith(`flags.${modulename}.inventory.`)) continue;
      if (k === addKey) continue;
      updateDataFlat[k] = v;
    }
    if (Object.keys(updateDataFlat).length) {
      const updateData = foundry.utils.expandObject(updateDataFlat);
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



