export class ThreeO {
  
  static async init() {
  }

  static async roll(player, withHope) {
    // Функция выбора случайного сообщения из таблицы
    const getRandomMessageFromTable = async (tableUUID) => {
      const table =  game.tables.find(t => t.uuid === tableUUID);
      if (table) {
        const roll = await table.roll();
        return roll.results[0].text; // Получаем текст первого результата
      }
      return "";
    };

    let dicepoolPlayer = game.candles.playerDiceCountTextUUID;
    let dicepoolGM = game.candles.gmDiceCountTextUUID;

    let playerSuccessesTable = game.settings.get('oxy949-ten-candles', 'playerSuccessesTableUUID');
    let playerFailureTable = game.settings.get('oxy949-ten-candles', 'playerFailureTableUUID');
    let gmSuccessesTable = game.settings.get('oxy949-ten-candles', 'gmSuccessesTableUUID');
    let gmFailureTable = game.settings.get('oxy949-ten-candles', 'gmFailureTableUUID');

    let diceCountPlayers = parseInt(canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === dicepoolPlayer)].document.text);
    let diceCountGM = parseInt(canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === dicepoolGM)].document.text);

    let successes = 0;
    let failures = 0;
    let rollMessage = 'Проверка повествования...';

    let diceCount = player ? diceCountPlayers : diceCountGM;
    let roll = await new Roll(`${diceCount}d6`).evaluate({ async: true });

    if (player && withHope) {
        console.log('Rolling Hope');
        let rollHope = await new Roll('1df').evaluate({ async: true });
        if (rollHope.terms[0].results[0].result >= 1) {
            successes += 1;
        }

        let speaker = ChatMessage.getSpeaker({ actor: game.user.character });
        await rollHope.toMessage({ rollMode: 'publicroll', flavor: 'Кость Надежды:', speaker });
    }

    roll.terms[0].results.forEach(r => {
        if (r.result === 1) { failures += 1 }
        if (r.result === 6) { successes += 1 }
    });

    if (successes > 0) {
        rollMessage = player ? await getRandomMessageFromTable(playerSuccessesTable) : await getRandomMessageFromTable(gmSuccessesTable);
    } else {
        rollMessage = player ? await getRandomMessageFromTable(playerFailureTable) : await getRandomMessageFromTable(gmFailureTable);
    }

    rollMessage += "<p>";
    if (successes === 0) {
        rollMessage += `<strong style="font-size: large;">ПРОВАЛ</strong>`;
    } else {
        if (successes === 1)
            rollMessage += `<strong style="font-size: large;">УСПЕХ</strong>`;
        else {
            rollMessage += `<strong style="font-size: large;">УСПЕХ (${successes})</strong>`;
        }
    }

    let statsMessage = ``;
    if (player)
        statsMessage += `<br>"1" выпало: <strong>${failures}</strong>`;

    // Добавляем кнопку в сообщение
    let buttonId = `reduce-dice`;
    if (player && failures > 0) {  // Уникальный флаг для каждого сообщения
      statsMessage += `<button id="${buttonId}" data-failures="${failures}" style="margin-top: 10px; margin-bottom: 10px;">Убрать все "1" (${failures} шт.) из пула игроков</button>`;
  }

    let flavor = `${rollMessage}${statsMessage}</p>`;

    let speaker = ChatMessage.getSpeaker({ actor: game.user.character });
    let chatMessage = await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });
  }

  static async rollPlayer(withHope) {
    await game.candles.roll(true, withHope);
  }
}  