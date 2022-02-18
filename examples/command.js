const { Command, CommandType } = require('gcommands');
const settings = require("../config/settings.json");

new Command({
	name: '',
	description: '',
	type: [CommandType.SLASH],
	guildId: settings.bot.server_id,
	run: (ctx) => {

	}
});

/*

Güzel kardeşim üstteki ile harika komutlar oluşturabilirsin.

*/