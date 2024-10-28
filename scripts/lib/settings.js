export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-threeO";

	game.settings.register(modulename, 'candlesConfigPath', {
		name: "Candles Config File Path",
		hint: "Specify the path to the JSON file containing candle and bowl UUIDs.",
		scope: 'world',
		config: true,
		type: String,
		default: 'modules/'+modulename+'/candlesConfig.json', // Укажи путь по умолчанию
		filePicker: true, // Позволяет выбрать файл через интерфейс Foundry
        requiresReload: true
	  });
}
