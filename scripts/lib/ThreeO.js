export class ThreeO {
  
  static async init() {
  }

  static async roll(diceCount, modifier = 'normal') {
    let successes = 0;
    let empty = 0;
    let failures = 0;

    let roll = await new Roll(`${diceCount}df`).evaluate({ async: true });

    roll.terms[0].results.forEach(r => {
        if (r.result === -1) { failures += 1 }
        if (r.result === 0) { empty += 1 }
        if (r.result === 1) { successes += 1 }
    });

    let rollMessage = "<p>";
    rollMessage += `<strong style="font-size: large;">Бросок: (${modifier})</strong><br>`;
    rollMessage += `<strong style="font-size: large;">-1: (${failures})</strong><br>`;
    rollMessage += `<strong style="font-size: large;">0: (${empty})</strong><br>`;
    rollMessage += `<strong style="font-size: large;">1: (${successes})</strong><br>`;
    rollMessage += "</p>";

    let resourceRemoved = 0;
    let totalResult = 0;
    if (modifier === 'normal'){
      resourceRemoved = failures;
      totalResult = successes - failures;
    }
    else if (modifier === 'hard'){
      resourceRemoved = failures + empty;
      totalResult = successes - failures - empty;
    }
    else if (modifier === 'easy'){
      resourceRemoved = failures;
      totalResult = successes - failures + empty;
    }

    let statsMessage = `Итого нужно ресурса: ${resourceRemoved}`;
    statsMessage += `Итого результат: ${totalResult}`;

    // Добавляем кнопку в сообщение
    let buttonId = `reduce-dice`;
    if (true) {
      statsMessage += `<button id="${buttonId}" data-failures="${failures}" style="margin-top: 10px; margin-bottom: 10px;">Убрать все "1" (${failures} шт.) из пула игроков</button>`;
    }

    let flavor = `${rollMessage}${statsMessage}`;

    let speaker = ChatMessage.getSpeaker({ actor: game.user.character });
    let chatMessage = await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });
  }
}  