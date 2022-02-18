const { Listener } = require('gcommands');
const settings = require("../config/settings.json");

new Listener({
	name: 'ready',
	event: 'ready',
	run: (client) => {
        client.user.setPresence({ activities: [{ name: "/verify send" }], status: "dnd" });
	}
});
