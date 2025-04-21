export class ThreeO {
    static async init() {}
  
    static async roll(diceCount, modifier = 'normal') {
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
      const easyMode = game.settings.get(modulename, "easyModeLyghtburg");
  
      let successes = 0;
      let empty = 0;
      let failures = 0;
  
      // Генерация броска
      const roll = await new Roll(`${diceCount}df`).evaluate({ async: true });
  
      roll.terms[0].results.forEach(r => {
        if (r.result === -1) failures += 1;
        if (r.result === 0) empty += 1;
        if (r.result === 1) successes += 1;
      });
  
      // Формирование текста сообщения
      let rollMessage = "<p>";
      let rollDiceText = "Действует как обычно, ";
  
      if (diceCount === '1') {
        rollDiceText = "Действует осторожно, ";
      } else if (diceCount === '3') {
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
  
      const resourceName = game.settings.get(modulename, "resourceName");
  
      let statsMessage = "";
      if (resourceRemoved > 0) {
        statsMessage += `<strong style="color: red;">Потеря ${resourceName}: ${resourceRemoved}<br></strong>`;
      } else if (resourceRemoved < 0) {
        statsMessage += `<strong style="color: green;">Восстановление ${resourceName}: ${Math.abs(resourceRemoved)}<br></strong>`;
      } else {
        statsMessage += `<strong style="color: grey;">Состояние не изменилось<br></strong>`;
      }
  
      statsMessage += `<strong style="font-size: medium;">Успешность: ${totalResult}</strong>`;
  
      if (currentHP <= resourceRemoved) {
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
  
      const roll = await new Roll(`${diceCount}df`).evaluate({ async: true });
  
      roll.terms[0].results.forEach(r => {
        if (r.result === -1) failures += 1;
        if (r.result === 0) empty += 1;
        if (r.result === 1) successes += 1;
      });
  
      // Формирование текста сообщения
      let rollMessage = "<p>";
      let rollDiceText = "Талисман обычно";
  
      if (diceCount === '1') {
        rollDiceText = "Талисман осторожно";
      } else if (diceCount === '3') {
        rollDiceText = "Талисман опасно";
      }
  
      rollMessage += `<strong style="font-size: large;">${rollDiceText}</strong><br>`;
      if (qty - failures > 0) {
        rollMessage += `<strong style="font-size: large;">Осталось зарядов талисмана:${qty - failures}</strong><br>`;
      }
      else {
        rollMessage += `<strong style="font-size: large;">Талисман всё</strong><br>`;
      }
      rollMessage += "</p>";
  
      let totalResult = (successes + empty) * 2;
      let resourceName = game.settings.get(modulename, "resourceName");

      if (failures >= qty){
        totalResult = totalResult * 0.5;
      }
  
      let statsMessage = `<strong style="color: green;">Восстановление ${resourceName}: ${totalResult}<br></strong>`;
      if (failures >= qty) {        
        if (currentHP <= failures - qty) {
            statsMessage = `<strong style="font-size: large;">Недостаточно ресурса, потеря сознания!</strong>`;
        }
      }
      const flavor = `${rollMessage}${statsMessage}`;
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
  