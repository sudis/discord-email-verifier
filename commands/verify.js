const { Command, CommandType, ArgumentType, Argument } = require('gcommands');
const { MessageEmbed } = require('discord.js');
const settings = require("../config/settings.json");
const { sendMail, hideEmail } = require('../config/functions');
const { pool } = require('../config/mysql');
const ms = require('ms');

new Command({
	name: 'verify',
	description: 'Doğrulama ile ilgili komutları içerir.',
	guildId: settings.bot.server_id,
	arguments: [
		new Argument({
			name: "send",
			description: "E-postana doğrulama kodunu gönder.",
			type: ArgumentType.SUB_COMMAND,
			options: [
				new Argument({
					name: "email",
					description: "E-postan nedir?",
					type: ArgumentType.STRING,
					required: true,
				})
			],
		}),

		new Argument({
			name: "me",
			description: "E-postana gelen doğrulama kodunu girerek doğrulama işlemini tamamla.",
			type: ArgumentType.SUB_COMMAND,
			options: [
				new Argument({
					name: "code",
					description: "E-postana gelen dört haneli kod?",
					type: ArgumentType.STRING,
					required: true,
				})
			]
		})
	],
	type: [CommandType.SLASH],
	run: async (ctx) => {
		let argument = ctx.arguments.getSubcommand();

		if (argument === "send") {
			let email = ctx.arguments.getString('email');
			let email_checker = new RegExp('[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+');
			if (!email_checker.test(email)) return ctx.reply({
				content: `Girmiş olduğun e-posta bizim belirlediğimiz standartlara uymuyor. Lütfen e-postanı gözden geçir veya farklı bir e-posta dene.`,
				ephemeral: true
			});

			let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
			let expire = Date.now() + ms("5m");

			let user_checker = await pool.promise().query(`SELECT * FROM Verification WHERE member_id = '${ctx.member.id}'`);
			let fraud_checker = await pool.promise().query(`SELECT * FROM Verification WHERE email = '${email}'`);

			if (user_checker[0][0] && user_checker[0][0].status === "VERIFIED") {
					ctx.reply({
						content: `Zaten onaylandığın için tekrar onaylanma sürecini başlatamam.`,
						ephemeral: true
					});
					return;
			};

			if (fraud_checker[0][0]) {
				ctx.reply({
					content: `Bu e-posta adresi zaten kullanılıyor.`,
					ephemeral: true
				});
				return;
			}

			pool.query(`SELECT * FROM Verification WHERE member_id = '${ctx.member.id}'`, async (err, rows) => {
				if (err) throw err;
				if (rows.length < 1) {
					pool.query(`INSERT INTO Verification (member_id , email, code, expire_time) VALUES (?, ?, ?, ?)`, [ctx.member.id, email, code, expire]);
				} else {
					pool.query(`UPDATE Verification SET email = ?, code = ?, expire_time = ? WHERE member_id = ?`, [email, code, expire, ctx.member.id]);
				};
			});

			sendMail(email, ctx.member.user.username, code, ctx.member.user.avatarURL());

			ctx.reply({
				content: `Belirtmiş olduğunuz e-posta adresine doğrulama kodunu gönderdik. E-posta ulaşmazsa spam klasörünü kontrol etmeyi unutma. Yine de e-posta eline ulaşmazsa farklı bir e-posta ile tekrar komutu çalıştırabilirsin. (Ya da beş dakika bekleyip tekrar komutu çalıştır.)`,
				ephemeral: true
			});

			let embed = new MessageEmbed()
			.setAuthor({ name: ctx.member.user.username, iconURL: ctx.member.user.avatarURL({ dynamic: true }) })
			.setDescription(`Başarıyla epostana doğrulama kodunu gönderdim **Eftelya**. Doğrulama kodunu belirtmiş olduğun \`${hideEmail(email)}\` epostasına ilettik.\n\nEğer doğrulama işlemini yapmazsan e-postan veritabanından **beş dakika** içerisinde silinecek. (**<t:${Math.floor(expire / 1000)}>**)`)
			.setColor("#922D4D")

			ctx.channel.send({
				embeds: [embed]
			});
		};

		if (argument === "me") {
			let code = ctx.arguments.getString('code');
			let user_checker = await pool.promise().query(`SELECT * FROM Verification WHERE member_id = '${ctx.member.id}'`);

			if (!user_checker[0][0]) return ctx.reply({
				content: `Daha önce kendine e-posta göndermedin. Lütfen ilk olarak e-posta gönderimini yap.`,
				ephemeral: true
			});

			if (user_checker[0][0] && user_checker[0][0].status === "VERIFIED") {
					ctx.reply({
						content: `Zaten doğrulanmış durumdasın. Lütfen tekrar doğrulama işlemini yapmayın.`,
						ephemeral: true
					});
					return;
			};

			if (user_checker[0][0] && user_checker[0][0].code === code) {
				ctx.member.roles.remove(settings.roleDefs.unverifiedRole);
				ctx.member.roles.add(settings.roleDefs.verifiedRole);
				pool.query(`UPDATE Verification SET status = 'VERIFIED' WHERE member_id = ?`, [ctx.member.id]);
				ctx.reply({
					content: `Tebrikler! Doğrulama işlemini yaparak hesabınızın üstündeki blokajı kaldırdınız.`,
					ephemeral: true
				});
			} else {
				ctx.reply({
					content: `Girmiş olduğunuz kod hatalı. Eğer e-posta size ulaşmadıysa beş dakika sonra tekrar aynı e-posta ile deneme yapabilirsiniz.`,
					ephemeral: true
				});
			};
		}
	}
});
