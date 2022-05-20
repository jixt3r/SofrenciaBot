const Discord = require("discord.js");
const { MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js");
const filtro = (interaction) => {
    interaction.isSelectMenu()
}
const hwga = (msg) => {
    msg.pin();
    const colitor = msg.createMessageComponentCollector({
        filtro
    });
    colitor.on('collect', async (collected) => {
        if (collected.customId === "ft") {
            collected.reply(`🔒 Olá ${collected.user}, este ticket será fechado em 5 segundos...`).then(() => {
                setTimeout(() => {
                    collected.channel.delete()
                }, 5000)
            })
        }
    });
};

module.exports = {

    name: "ticket_menu",
    author: "Luc4s",

    run: async(message) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(`Apenas membros com a permissão de \`ADMINISTRADOR\`, poderão utilizar este comando.`);

        message.delete();

        let button_jojo = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ft')
                    .setStyle('SECONDARY')
                    .setEmoji('🔒')
            )

        let embed = new Discord.MessageEmbed()
            .setColor("#FF7000")
            .setDescription(`**Crie um ticket selecionando uma categoria abaixo:**`)
            .setThumbnail("https://cdn.discordapp.com/attachments/964639567674245200/967176649189752892/do_cara.png")
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

        let painel = new MessageActionRow().addComponents( new MessageSelectMenu()
            .setCustomId('menu')
            .setPlaceholder('Clique aqui.')
            .addOptions([
                {
                    label: 'Compra',
                    description: '',
                    emoji: '🙋‍♂️',
                    value: 'compra',
                },
                {
                    label: 'Suporte',
                    description: '',
                    emoji: '⛔',
                    value: 'suporte',
                },
            ])

        );

        message.channel.send({ embeds: [embed], components: [painel] }).then(msg => {

        const coletor = msg.createMessageComponentCollector({
            filtro
        });

            coletor.on('collect', async (collected) => {

                let ticket = collected.values[0]
                collected.deferUpdate()

                ja = async (name) => {
                    let c = await message.guild.channels.cache.find(c => c.name.toLowerCase() == name.toLowerCase());
                    if (c) {
                        await message.channel.send({ content: `Você já possui um ticket aberto em ${c}.` });
                        return true;
                    };
                    return false;
                };

                if (ticket === "compra") {

                    let cName = `🙋-${collected.user.username}`;
                    let stop = await ja(cName);
                    if (stop) return;

                    let embed_geral = new Discord.MessageEmbed()
                        .setColor("#FF7000")
                        .setDescription(`**🙋 Olá ${collected.user}, seu ticket foi criado na categoria \`Compra\`.**`);

                    message.guild.channels.create(cName, {
                        type : 'GUILD_TEXT',
                        //parent: "967180439754264658",
                        permissionOverwrites : [
             {
              id : message.guildId,
              deny : ['VIEW_CHANNEL']
             }
             {
              id : collected.user.id,
              allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
             }
                        ]
                    }).then(async (chat_ferinha) => {

                        chat_ferinha.send({ embeds: [embed_geral], components: [button_jojo] }).then(msg => hwga(msg) );

                    });
                }

                if (ticket === "suporte") {

                    let cName = `⛔-${collected.user.username}`;
                    let stop = await ja(cName);
                    if (stop) return;

                    let embed_denuncias = new Discord.MessageEmbed()
                        .setColor("#FF7000")
                        .setDescription(`**⛔ Olá ${collected.user}, seu ticket foi criado na categoria \`Suporte\`.**`);

                    message.guild.channels.create(cName, {
                        type : 'GUILD_TEXT',
                        //parent: "967180413250449428",
                        permissionOverwrites : [
                            {
                                id : message.guild.id,
                                deny : ['VIEW_CHANNEL']
                            },
                            {
                                id : collected.user.id,
                                allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
                            }
                        ]
                    }).then(async (chat_ferinha) => {

                        chat_ferinha.send({ embeds: [embed_denuncias], components: [button_jojo] }).then(msg => hwga(msg));
                    });
                }
            });
        })
    }
};
