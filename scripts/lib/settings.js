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

		game.settings.register(modulename, 'inspName', {
			name: "НАЗВАНИЕ ВДОХНОВЕНИЯ",
			hint: "Введите название для токенов поощрения игроков.",
			scope: "world",
			config: true,
			type: String,
			default: "Овации"
		  
	})	 

		// звук, когда игрок сам использует овацию
		game.settings.register(modulename, "inspSound", {
			name: "Звук использования овации",
			hint: "Аудио при перебросе кубиков за счёт овации.",
			scope: "world",
			config: true,
			type: String,
			default: "",
			filePicker: "audio"
		});

		// громкость использования
		game.settings.register(modulename, "inspVolume", {
			name: "Громкость использования овации",
			scope: "world",
			config: true,
			type: Number,
			range: { min: 0, max: 1, step: 0.05 },
			default: 0.8
		});

		// звук, когда мастер добавляет овацию
		game.settings.register(modulename, "gmInspSound", {
			name: "Звук выдачи овации (ГМ)",
			hint: "Аудио при добавлении овации мастером.",
			scope: "world",
			config: true,
			type: String,
			default: "",
			filePicker: "audio"
		});

		// громкость выдачи
		game.settings.register(modulename, "gmInspVolume", {
			name: "Громкость выдачи овации",
			scope: "world",
			config: true,
			type: Number,
			range: { min: 0, max: 1, step: 0.05 },
			default: 0.8
		});


	game.settings.register(modulename, 'easyModeLyghtburg', {
		name: "EASY MODE",
		hint: "Восстановление ресурсов (здоровья, рассудка и тп.) при выпадении плюсов.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: true,
		requiresReload: false
	  });

	  	game.settings.register(modulename, 'zeroMode', {
		name: "ДЕЙСТВИЯ ПРИ 0 РЕСУРСА",
		hint: "Возможность действовать при нулевом значении ресурса.",
		scope: 'world',
		config: true,
		type: Boolean,
		default: true,
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
		default: true,		
		requiresReload: true
	  });	

		game.settings.register(modulename, 'charInfoName', {
			name: "НАЗВАНИЕ ПОЛЯ ХАРАКТЕР",
			hint: "Обычно Характер, но мало-ли...",
			scope: "world",
			config: true,
			type: String,
			default: "Черты характера"
		  
	})	
	  game.settings.register(modulename, 'itemsName', {
			name: "НАЗВАНИЕ ФОБИЙ",
			hint: "Страхи, Грани, Анти-гениальности и тп.",
			scope: "world",
			config: true,
			type: String,
			default: "Фобии"
		  
	})	  
	  
	game.settings.register(modulename, "minInventoryRows", {
		name: "МИН. КОЛ-ВО ФОБИЙ",
		hint: "Установите количество ячеек всегда будут отображаться.",
		scope: "world",
		config: true,
		type: Number,
		default: 1,
		requiresReload: true  
});
	
}