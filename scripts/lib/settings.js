export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-threeO";

	game.settings.register(modulename, 'resourceName', {
			name: "ОБОЗНАЧЕНИЕ РЕСУРСА",
			hint: "Введите название ресурса в родительном падеже.",
			scope: "world",
			config: true,
			type: String,
			default: "рассудка"
		  
	})

	game.settings.register(modulename, 'easyModeLyghtburg', {
		name: "EASY MODE",
		hint: "Восстановление ресурсов (здоровья, рассудка и тп.) при выпадении плюсов.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	  });

	  	game.settings.register(modulename, 'zeroMode', {
		name: "ДЕЙСТВИЯ ПРИ 0 РЕСУРСА",
		hint: "Возможность действовать при нулевом значении ресурса.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: false
	  });


	game.settings.register(modulename, 'resourceShow', {
		name: "ПОКАЗЫВАТЬ РЕСУРС",
		hint: "Видимость значения ресурса для игроков.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
		requiresReload: true
	  });

	game.settings.register(modulename, 'actionList', {
		name: "БРОСКИ ИЗ ЧАРНИКА",
		hint: "Кнопки выбора действий прямо в листе персонажа",
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,		
		requiresReload: true
	  });	

	game.settings.register(modulename, 'itemsName', {
			name: "НАЗВАНИЕ ИНВЕНТАРЯ",
			hint: "Инвентарь | Задачи, Кринжи, Грани и тп.",
			scope: "world",
			config: true,
			type: String,
			default: "Инвентарь | Задачи"
		  
	})	  
	  
	game.settings.register(modulename, "minInventoryRows", {
		name: "МИН. КОЛ-ВО СТРОК ИНВЕНТАРЯ",
		hint: "Установите количество ячеек всегда будут отображаться.",
		scope: "world",
		config: true,
		type: Number,
		default: 3,
		requiresReload: true  
});
	
}