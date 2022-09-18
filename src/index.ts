import 'dotenv/config';
import post from 'node-fetch'
import { readFileSync, writeFileSync } from 'fs';
import { Client, Message, TextChannel, Interaction, InteractionReplyOptions, Options, ApplicationCommandDataResolvable } from 'discord.js';

const $: { SFWPOST: string, NSFWPOST: string, SOURCES: string[] } = JSON.parse(readFileSync('./data.json', 'utf8'));
const COMMANDS: ApplicationCommandDataResolvable[] = [
    { name: 'ping', description: 'Check my latency', type: 1 },
    { name: 'view', description: 'View channel list', type: 1 },
    {
        name: 'manage',
        description: 'Add/Remove channels from the list',
        options: [
            {
                name: 'type',
                description: `Add/Remove/Modify`,
                type: 'STRING',
                choices: ['add', 'remove', 'SFWPOST', 'NSFWPOST'].map(c => ({ name: c, value: c })),
                required: true
            },
            {
                name: 'channel',
                description: 'The channel ID',
                type: 'STRING',
                required: true
            }
        ]
    },
];
let SFWPOST: string = $.SFWPOST;
let NSFWPOST: string = $.NSFWPOST;
const TOKEN: string | undefined = process.env.TOKEN;
const SOURCES: string[] = $.SOURCES;

class Rosemary extends Client {
    public constructor() {
        super({ intents: ['GUILDS', 'GUILD_MESSAGES'], makeCache: Options.cacheWithLimits({ MessageManager: { maxSize: 10 } }) });
        this.on('ready', () => console.log(`Logged in as ${this.user?.tag}!`));
        this.on('messageCreate', this.message);
        this.on('interactionCreate', this.interaction);
        this.login(TOKEN);
    }

    private async build(message: Message) {
        const request: Error = await message.guild?.commands.set(COMMANDS).catch(e => e);
        message.reply(request instanceof Error ? request.message : 'Commands built successfully!');
    }

    private async interaction(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        const defer = (ephemeral = true) => interaction.deferReply({ ephemeral }).catch(() => null);
        const reply = (options: InteractionReplyOptions, edit = true) => interaction[edit ? 'editReply' : 'reply'](options).catch(() => { });
        switch (interaction.commandName) {
            case 'ping': {
                const time: number = Date.now();
                await defer();
                reply({ content: `\uD83C\uDFD3 Pong! \`${Date.now() - time}\`ms` });
                break;
            }
            case 'view': {
                await defer();
                const embed: { title: string, description: string, color: number } = { title: '', description: '', color: 0xCC905E };
                embed.title = `${this.user?.username} saves links from the following channels:`;
                const list: { sfw: string[], nsfw: string[] } = { sfw: [], nsfw: [] };
                for (const id of SOURCES) {
                    const channel: TextChannel = this.channels.cache.get(id) as TextChannel;
                    list[channel.nsfw ? 'nsfw' : 'sfw'].push(`\u2022 \`#${channel.name}\``);
                }
                embed.description = `**SFW**:\n${list.sfw.join('\n')}\n\n**NSFW**:\n${list.nsfw.join('\n')}`;
                reply({ embeds: [embed] });
                break;
            }
            case 'manage': {
                await defer();
                if (!['476812566530883604', '288450828837322764'].includes(interaction.user.id)) {
                    reply({ content: 'You are not allowed to use this command!' });
                    break;
                }
                const write: Function = () => {
                    writeFileSync('./data.json', JSON.stringify({ SFWPOST, NSFWPOST, SOURCES }));
                    reply({ content: 'Updates made successfully!' });
                }
                const id: string = interaction.options.getString('channel', false) as string;
                const channel: TextChannel = this.channels.cache.get(id) as TextChannel;
                const match: RegExpMatchArray | null = id.match(/https:\/\/discord\.com\/api\/webhooks\/\d{17,18}\/.*\?thread_id=\d{17,18}/g);
                switch (interaction.options.getString('type', false)) {
                    case 'add': {
                        if (!channel) reply({ content: 'Channel not found!' });
                        else if (SOURCES.includes(id)) reply({ content: 'Channel already added!' });
                        else {
                            SOURCES.push(id);
                            write();
                        }
                        break;
                    }
                    case 'remove': {
                        if (!channel) reply({ content: 'Channel not found!' });
                        else if (!SOURCES.includes(id)) reply({ content: 'Channel does not exist on the list!' });
                        else {
                            SOURCES.splice(SOURCES.indexOf(id), 1);
                            write();
                        }
                        break;
                    }
                    case 'SFWPOST': {
                        if (!Array.isArray(match) || !match.some(e => e)) reply({ content: 'Invalid webhook URL!' });
                        else {
                            SFWPOST = id;
                            write();
                        }
                        break;
                    }
                    case 'NSFWPOST': {
                        if (!Array.isArray(match) || !match.some(e => e)) reply({ content: 'Invalid webhook URL!' });
                        else {
                            NSFWPOST = id;
                            write();
                        }
                        break;
                    }
                }
                break;
            }
        }
    }

    private async message(message: Message) {
        if (message.author.bot) return;
        if (message.content === 'r.build' && message.inGuild()) return this.build(message);
        if (!SOURCES.includes(message.channel.id)) return;
        if (message.attachments.size) for (const media of message.attachments.values()) this.post((media as { attachment: string }).attachment, message);
        let urls: RegExpMatchArray | null = [];
        for (const regex of [
            /((https?:\/\/)?(www\.)?twitter\.com\/)[A-z]*\/status\/\d*/g,
            /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp|jpeg|mp4)/g,
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
        ]) urls = [...urls, ...(message.content.match(regex) || [])];
        if (Array.isArray(urls) && urls.some(e => e)) for (const url of urls) this.post(url, message);
    }

    private post(url: String, message: Message) {
        const channel: TextChannel = message.channel as TextChannel;
        const image: RegExpMatchArray | null = url.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp|jpeg|mp4)/g);
        const content: string = `Posted in [\`#${channel.name}\`](${url}) ${Array.isArray(image) && image.some(e => e) ? `[\`Reverse Search?\`](https://saucenao.com/search.php?url=${url})` : ''}`;
        post(channel.nsfw ? NSFWPOST : SFWPOST, { method: 'POST', body: JSON.stringify({ content }), headers: { 'Content-Type': 'application/json' } });
    }
}

export default new Rosemary();
