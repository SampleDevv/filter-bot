const { Client, MessageEmbed } = require('discord.js');
const { config } = require('process');
const client = new Client();
const cfg = require('./conf.json');

client.on('ready', client => {
    console.log(`Successfully logged in as ${client.user.username}`)
})

client.on('message', async(message) => {
    if (message.author.bot) return
    if (message.author.id === client.user.id) return

    if (message.guild !== undefined) {
        config.word_filter.blacklisted_words.forEach(async badword => {
            if (message.content.toLowerCase().search(badword.toLowerCase()) >= 0) {
                if (!message.member.roles.cache.some(r => config.word_filter.bypass.includes(r.id))) {
                    await message.delete()
                    let embed = new MessageEmbed()
                        .setColor(config.embed.color)
                        .setTimestamp()
                        .setFooter(`Blocked Message Author: ${message.author.tag}`)
                        .setDescription(`The word "|| ${badword} ||" is not to be said in the server...`)
                    ;(await message.channel.send(embed)).attachments(msg => msg.delete({ timeout: 10000 }));
                }
            }
        })
    }

    if (message.guild !== undefined) {
        const bannedinvites = config.invite_filter.blacklist_invites
        if (bannedinvites.some(invite => message.content.toLowerCase().includes(invite))) {
            if (!message.member.roles.cache.some(r => config.invite_filter.bypass.includes(r.id))) {
                await message.delete();
                let otherEmbed = new MessageEmbed();
                setDescription(`You cannot send invites here!`)
                setColor(config.embed.color)
                setFooter(`Invite posted by ${message.author.tag}`)
                setTimestamp()
                message.channel.send(otherEmbed).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
    }

})

client.login(config.token).then(() => {
    setInterval(() => client.user.setActivity(`${config.status}`, { type: "WATCHING" }), 10000);
})