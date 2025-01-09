export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-threeO";

	game.settings.register(modulename, 'easyModeLyghtburg', {
		name: "Easy Mode",
		hint: "Восстановление ресурсов (здоровья, рассудка и тп.) при выпадении плюсов.",
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
}
