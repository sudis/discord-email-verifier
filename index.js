const { GClient, Plugins, Command, Component } = require('gcommands');
const { Intents } = require('discord.js');
const { join } = require('path');
const settings = require("./config/settings.json");
require("./config/mysql.js");
const nodemailer = require("nodemailer");
const { sendMail, emailCheck } = require('./config/functions');

Command.setDefaults({
	cooldown: '20s',
});

Component.setDefaults({
	onError: (ctx, error) => {
		return ctx.reply('Oops! Something went wrong')
	} 
});

Plugins.search(__dirname);

const client = new GClient({
	dirs: [
		join(__dirname, 'commands'),
		join(__dirname, 'components'),
		join(__dirname, 'listeners')
	],
	messagePrefix: '!',
	devGuildId: settings.bot.server_id,
	intents: Object.keys(Intents.FLAGS),
});
  
client.on("ready", async () => {
	emailCheck();
});

client.login(settings.bot.token);