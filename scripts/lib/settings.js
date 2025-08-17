export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-threeO";

	game.settings.register(modulename, "actionMacroId", {
    name: "ID Макроса",
    hint: "Укажите ID макроса, который будет выполняться при нажатии кнопки под ХП.",
    scope: "world",
    config: true,
    type: String,
    default: "",   // по умолчанию пусто
});

	game.settings.register(modulename, 'easyModeLyghtburg', {
		name: "Easy Mode",
		hint: "Восстановление ресурсов (здоровья, рассудка и тп.) при выпадении плюсов.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	  });

	  	game.settings.register(modulename, 'zeroMode', {
		name: "Действия при 0 ресурса",
		hint: "Возможность действовать при нулевом значении ресурса.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	  });

	game.settings.register(modulename, 'resourceName', {
			name: "Обозначение ресурса",
			hint: "Введите название ресурса в родительном падеже.",
			scope: "world",
			config: true,
			type: String,
			default: "рассудка"
		  
	})

	game.settings.register(modulename, 'resourceShow', {
		name: "Показывать ресурс",
		hint: "Видимость значения ресурса для игроков.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: true
	  });	
	  
	game.settings.register(modulename, "minInventoryRows", {
		name: "Минимальное количество строк в инвентаре",
		hint: "Установите количество ячеек всегда будут отображаться.",
		scope: "world",
		config: true,
		type: Number,
		default: 3,
		requiresReload: true  
});
game.settings.register(modulename, "generalBackgroundColor", {
        name: "Общий фон",
        hint: "Выберите цвет для общего фона.",
        scope: "world",
        config: true,
        type: String,
        default: "rgba(168, 168, 168, 0.9)", // Значение по умолчанию
        // Используйте colorPicker для выбора цвета
        onChange: () => updateStyles(),
    });

    // Регистрация настройки для фона инвентаря
    game.settings.register(modulename, "inventoryBackgroundColor", {
        name: "Фон инвентаря",
        hint: "Выберите цвет для фона инвентаря.",
        scope: "world",
        config: true,
        type: String,
        default: "#f8f9fa", // Значение по умолчанию
        onChange: () => updateStyles(),
		   });
}