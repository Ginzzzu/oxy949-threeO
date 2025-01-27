export class ThreeO {
  
  static async init() {
  }

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
    
    let modulename = "oxy949-threeO";
    let easyMode = game.settings.get(modulename, "easyModeLyghtburg")

    let successes = 0;
    let empty = 0;
    let failures = 0;

    // Генерация броска
    let roll = await new Roll(`${diceCount}df`).evaluate({ async: true });

    roll.terms[0].results.forEach(r => {
        if (r.result === -1) { failures += 1; }
        if (r.result === 0) { empty += 1; }
        if (r.result === 1) { successes += 1; }
    });

    // Формирование текста сообщения
    let rollMessage = "<p>";
    let rollDiceText = "Действует как обычно, ";
    if (diceCount == '1') {
        rollDiceText = "Действует осторожно, ";
    } else if (diceCount == '3') {
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
    if (easyMode){
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
    const resourceName = game.settings.get("oxy949-threeO", "resourceName");
    let statsMessage = ``;
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

    let flavor = `${rollMessage}${statsMessage}`;
    let speaker = ChatMessage.getSpeaker({ actor: character });

    // Сообщение в чат и автоматическая анимация кубиков
    await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });

    // После завершения анимации наносим урон с задержкой
    Hooks.once("diceSoNiceRollComplete", () => {
        setTimeout(() => {
            character.applyDamage(resourceRemoved);
        }, 500); // Задержка в миллисекундах (500 = 0.5 секунды)
    });
  }
}
