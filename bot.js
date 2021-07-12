const Discord = require("discord.js");
const client = new Discord.Client({ disableMentions: "everyone" });
const ayarlar = require("./ayarlar.json");
const AntiSpam = require("discord-anti-spam");
const db = require("quick.db");
const fs = require("fs");
const moment = require("moment");
require("./util/eventLoader")(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`+-+-+-+ ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

// botun oynuyor kısmı //

client.on("ready", () => {
  var actvs = [`#<31`, `Moscow ❤ Wagner`];

  client.user.setActivity(
    actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)],
    { type: "WATCHING" }
  );
  setInterval(() => {
    client.user.setActivity(
      actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)],
      { type: "WATCHING" }
    );
  }, 15000);

  // konsol logları //

  console.log(
    `İsmim                                  : ${client.user.username}`
  );
  console.log(
    `şu kadar sunucuda varım                : ${client.guilds.cache.size}`
  );
  console.log(
    `Bu kadar kullanıcı beni kullanıyo      : ${client.users.cache.size}`
  );
  console.log(`Prefix                                 : ${ayarlar.prefix}`);
  console.log(`durumum                                : Bot Çevrimiçi!`);
  console.log("Yapımcı                                : Moscow ");
  console.log(
    "Discordumuz                            : https://discord.gg/AYPRbE8HBU"
  );
});

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

// belirlediğiniz kişiye rol verilir //

// örnek kullanım: /rolver @kişi @rol

client.on("message", message => {
  if (message.content.startsWith("/rolver")) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("yetkin yok");
    let role = message.mentions.roles.first();
    let member = message.mentions.members.first();
    member.roles.add(role);
    client.on("guildMemberAdd", member => {
      const hg = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(member.guild.name + "adlı kişiye başarı ile rol verildi")
        .setDescription(`tebrikler.`)
        .setFooter("iyi günler")
        .setTimestamp();
      member.send(hg);
    });
  }
});

// komutu kullandığınız kişiden rol alır //

// örnek kullanım: /rolal @kişi @rol //

client.on("message", message => {
  if (message.content.startsWith("/rolal")) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("yetkin yok");
    let role = message.mentions.roles.first();
    let member = message.mentions.members.first();
    member.roles.remove(role);
    client.on("guildMemberAdd", member => {
      const hg = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(member.guild.name + "adlı kişiye başarı ile rol alındı")
        .setDescription(`iyi günler.`)
        .setFooter("düşün biraz")
        .setTimestamp();
      member.send(hg);
    });
  }
});

// **sahip** yazan birine özelden mesaj atar //

client.on("message", msg => {
  if (msg.content.toLocaleLowerCase() === ".tag") {
    msg.channel.send("``etiket : #1827``", "``isim : Wagner``");
  }
});

client.on("message", msg => {
  if (msg.content.toLocaleLowerCase() === ".tag") {
    msg.channel.send("``isim : Wagner``");
  }
});

// belirlediğiniz kanala sunucunuza katılan birine hg mesajı atar //

client.on("guildMemberAdd", member => {
  require("moment-duration-format");
  var üyesayısı = member.guild.members.cache.size
    .toString()
    .replace(/ /g, "    ");
  var üs = üyesayısı.match(/([0-9])/g);
  üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
  if (üs) {
    üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
      return {
        "0": `**0**`,
        "1": `**1**`,
        "2": `**2**`,
        "3": `**3**`,
        "4": `**4**`,
        "5": `**5**`,
        "6": `**6**`,
        "7": `**7**`,
        "8": `**8**`,
        "9": `**9**`
      }[d];
    });
  }
  const kanal = member.guild.channels.cache.find(
    r => r.id === "859710202390380544"
  ); //mesaj atılcak kanal id
  let register = "859691658185670666";
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gecen = moment
    .duration(kurulus)
    .format(
      ` YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`
    );
  var kontrol;
  if (kurulus < 1296000000) kontrol = "Hesap Durumu: tehlikeli";
  if (kurulus > 1296000000) kontrol = "Hesap Durumu: güvenli";
  moment.locale("tr");
  const embed = new Discord.MessageEmbed()
    .setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
    .setDescription(
      `
 ┊ <@` +
        member.id +
        `> **Sunucumuza Katıldı !** 

 ┊ **Seninle birlikte **{ ` +
        üyesayısı +
        ` }** kişiye ulaştık !**

 ┊ **Sunucumuzun kurallarına uymayı unutma, kurallarımızı okumanı tavsiye ederiz.**

 ┊ **İçeride keyifli vakitler geçirmeni dileriz.**
`
    )
    .setImage(`https://i.ibb.co/qkhQ2wr/Peding-Hosgeldin.gif`);
  kanal.send(embed);
  kanal.send(`<@&${register}>`);
});

// sunucuya yeni katılan birine özelden hg mesajı atar

client.on("guildMemberAdd", member => {
  const hg = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(member.guild.name + "sunucumuza hoşgeldin")
    .setDescription(`Sunucumuza Hoşgeldin.`)
    .setFooter("Hoşgeldin")
    .setTimestamp();
  member.send(hg);
});

// reklam yapanlara karşı koruma //

// flood ypanlara karşı koruma //

const antiSpam = new AntiSpam({
  warnThreshold: 3,
  muteThreshold: 4,
  kickThreshold: 7,
  banThreshold: 7,
  maxInterval: 2000,
  warnMessage: "{@user}, spam yapma.",
  kickMessage: "**{user_tag}** spam yaptığı için atıldı.",
  muteMessage: "**{user_tag}** spam yaptığı için susturuldu.",
  banMessage: "**{user_tag}** spam yaptığı için banlandı.",
  maxDuplicatesWarning: 6,
  maxDuplicatesKick: 10,
  maxDuplicatesBan: 12,
  maxDuplicatesMute: 8,
  ignoredPermissions: ["ADMINISTRATOR"], // flood yapmaktan etkilenmeyeck rol
  ignoreBots: true,
  verbose: true,
  ignoredMembers: [],
  muteRoleName: "CEZALI", // verilecek rolün ismi
  removeMessages: true
});

const küfür = [
  "abaza",
  "abazan",
  "ag",
  "a\u011fz\u0131na s\u0131\u00e7ay\u0131m",
  "ahmak",
  "allah",
  "allahs\u0131z",
  "am",
  "amar\u0131m",
  "ambiti",
  "am biti",
  "amc\u0131\u011f\u0131",
  "amc\u0131\u011f\u0131n",
  "amc\u0131\u011f\u0131n\u0131",
  "amc\u0131\u011f\u0131n\u0131z\u0131",
  "amc\u0131k",
  "amc\u0131k ho\u015faf\u0131",
  "amc\u0131klama",
  "amc\u0131kland\u0131",
  "amcik",
  "amck",
  "amckl",
  "amcklama",
  "amcklaryla",
  "amckta",
  "amcktan",
  "amcuk",
  "am\u0131k",
  "am\u0131na",
  "am\u0131nako",
  "am\u0131na koy",
  "am\u0131na koyar\u0131m",
  "am\u0131na koyay\u0131m",
  "am\u0131nakoyim",
  "am\u0131na koyyim",
  "am\u0131na s",
  "am\u0131na sikem",
  "am\u0131na sokam",
  "am\u0131n feryad\u0131",
  "am\u0131n\u0131",
  "am\u0131n\u0131 s",
  "am\u0131n oglu",
  "am\u0131no\u011flu",
  "am\u0131n o\u011flu",
  "am\u0131s\u0131na",
  "am\u0131s\u0131n\u0131",
  "amina",
  "amina g",
  "amina k",
  "aminako",
  "aminakoyarim",
  "amina koyarim",
  "amina koyay\u0131m",
  "amina koyayim",
  "aminakoyim",
  "aminda",
  "amindan",
  "amindayken",
  "amini",
  "aminiyarraaniskiim",
  "aminoglu",
  "amin oglu",
  "amiyum",
  "amk",
  "amkafa",
  "amk \u00e7ocu\u011fu",
  "amlarnzn",
  "aml\u0131",
  "amm",
  "ammak",
  "ammna",
  "amn",
  "amna",
  "amnda",
  "amndaki",
  "amngtn",
  "amnn",
  "amona",
  "amq",
  "ams\u0131z",
  "amsiz",
  "amsz",
  "amteri",
  "amugaa",
  "amu\u011fa",
  "amuna",
  "ana",
  "anaaann",
  "anal",
  "analarn",
  "anam",
  "anamla",
  "anan",
  "anana",
  "anandan",
  "anan\u0131",
  "anan\u0131",
  "anan\u0131n",
  "anan\u0131n am",
  "anan\u0131n am\u0131",
  "anan\u0131n d\u00f6l\u00fc",
  "anan\u0131nki",
  "anan\u0131sikerim",
  "anan\u0131 sikerim",
  "anan\u0131sikeyim",
  "anan\u0131 sikeyim",
  "anan\u0131z\u0131n",
  "anan\u0131z\u0131n am",
  "anani",
  "ananin",
  "ananisikerim",
  "anani sikerim",
  "ananisikeyim",
  "anani sikeyim",
  "anann",
  "ananz",
  "anas",
  "anas\u0131n\u0131",
  "anas\u0131n\u0131n am",
  "anas\u0131 orospu",
  "anasi",
  "anasinin",
  "anay",
  "anayin",
  "angut",
  "anneni",
  "annenin",
  "annesiz",
  "anuna",
  "aptal",
  "aq",
  "a.q",
  "a.q.",
  "aq.",
  "ass",
  "atkafas\u0131",
  "atm\u0131k",
  "att\u0131rd\u0131\u011f\u0131m",
  "attrrm",
  "auzlu",
  "avrat",
  "ayklarmalrmsikerim",
  "azd\u0131m",
  "azd\u0131r",
  "azd\u0131r\u0131c\u0131",
  "babaannesi ka\u015far",
  "baban\u0131",
  "baban\u0131n",
  "babani",
  "babas\u0131 pezevenk",
  "baca\u011f\u0131na s\u0131\u00e7ay\u0131m",
  "bac\u0131na",
  "bac\u0131n\u0131",
  "bac\u0131n\u0131n",
  "bacini",
  "bacn",
  "bacndan",
  "bacy",
  "bastard",
  "basur",
  "beyinsiz",
  "b\u0131z\u0131r",
  "bitch",
  "biting",
  "bok",
  "boka",
  "bokbok",
  "bok\u00e7a",
  "bokhu",
  "bokkkumu",
  "boklar",
  "boktan",
  "boku",
  "bokubokuna",
  "bokum",
  "bombok",
  "boner",
  "bosalmak",
  "bo\u015falmak",
  "cenabet",
  "cibiliyetsiz",
  "cibilliyetini",
  "cibilliyetsiz",
  "cif",
  "cikar",
  "cim",
  "\u00e7\u00fck",
  "dalaks\u0131z",
  "dallama",
  "daltassak",
  "dalyarak",
  "dalyarrak",
  "dangalak",
  "dassagi",
  "diktim",
  "dildo",
  "dingil",
  "dingilini",
  "dinsiz",
  "dkerim",
  "domal",
  "domalan",
  "domald\u0131",
  "domald\u0131n",
  "domal\u0131k",
  "domal\u0131yor",
  "domalmak",
  "domalm\u0131\u015f",
  "domals\u0131n",
  "domalt",
  "domaltarak",
  "domalt\u0131p",
  "domalt\u0131r",
  "domalt\u0131r\u0131m",
  "domaltip",
  "domaltmak",
  "d\u00f6l\u00fc",
  "d\u00f6nek",
  "d\u00fcd\u00fck",
  "eben",
  "ebeni",
  "ebenin",
  "ebeninki",
  "ebleh",
  "ecdad\u0131n\u0131",
  "ecdadini",
  "embesil",
  "emi",
  "fahise",
  "fahi\u015fe",
  "feri\u015ftah",
  "ferre",
  "fuck",
  "fucker",
  "fuckin",
  "fucking",
  "gavad",
  "gavat",
  "geber",
  "geberik",
  "gebermek",
  "gebermi\u015f",
  "gebertir",
  "ger\u0131zekal\u0131",
  "gerizekal\u0131",
  "gerizekali",
  "gerzek",
  "giberim",
  "giberler",
  "gibis",
  "gibi\u015f",
  "gibmek",
  "gibtiler",
  "goddamn",
  "godo\u015f",
  "godumun",
  "gotelek",
  "gotlalesi",
  "gotlu",
  "gotten",
  "gotundeki",
  "gotunden",
  "gotune",
  "gotunu",
  "gotveren",
  "goyiim",
  "goyum",
  "goyuyim",
  "goyyim",
  "g\u00f6t",
  "g\u00f6t deli\u011fi",
  "g\u00f6telek",
  "g\u00f6t herif",
  "g\u00f6tlalesi",
  "g\u00f6tlek",
  "g\u00f6to\u011flan\u0131",
  "g\u00f6t o\u011flan\u0131",
  "g\u00f6to\u015f",
  "g\u00f6tten",
  "g\u00f6t\u00fc",
  "g\u00f6t\u00fcn",
  "g\u00f6t\u00fcne",
  "g\u00f6t\u00fcnekoyim",
  "g\u00f6t\u00fcne koyim",
  "g\u00f6t\u00fcn\u00fc",
  "g\u00f6tveren",
  "g\u00f6t veren",
  "g\u00f6t verir",
  "gtelek",
  "gtn",
  "gtnde",
  "gtnden",
  "gtne",
  "gtten",
  "gtveren",
  "hasiktir",
  "hassikome",
  "hassiktir",
  "has siktir",
  "hassittir",
  "haysiyetsiz",
  "hayvan herif",
  "ho\u015faf\u0131",
  "h\u00f6d\u00fck",
  "hsktr",
  "huur",
  "\u0131bnel\u0131k",
  "ibina",
  "ibine",
  "ibinenin",
  "ibne",
  "ibnedir",
  "ibneleri",
  "ibnelik",
  "ibnelri",
  "ibneni",
  "ibnenin",
  "ibnerator",
  "ibnesi",
  "idiot",
  "idiyot",
  "imansz",
  "ipne",
  "iserim",
  "i\u015ferim",
  "ito\u011flu it",
  "kafam girsin",
  "kafas\u0131z",
  "kafasiz",
  "kahpe",
  "kahpenin",
  "kahpenin feryad\u0131",
  "kaka",
  "kaltak",
  "kanc\u0131k",
  "kancik",
  "kappe",
  "karhane",
  "ka\u015far",
  "kavat",
  "kavatn",
  "kaypak",
  "kayyum",
  "kerane",
  "kerhane",
  "kerhanelerde",
  "kevase",
  "keva\u015fe",
  "kevvase",
  "koca g\u00f6t",
  "kodu\u011fmun",
  "kodu\u011fmunun",
  "kodumun",
  "kodumunun",
  "koduumun",
  "koyarm",
  "koyay\u0131m",
  "koyiim",
  "koyiiym",
  "koyim",
  "koyum",
  "koyyim",
  "krar",
  "kukudaym",
  "laciye boyad\u0131m",
  "lavuk",
  "libo\u015f",
  "madafaka",
  "mal",
  "malafat",
  "malak",
  "manyak",
  "mcik",
  "meme",
  "memelerini",
  "mezveleli",
  "minaamc\u0131k",
  "mincikliyim",
  "mna",
  "monakkoluyum",
  "motherfucker",
  "mudik",
  "oc",
  "ocuu",
  "ocuun",
  "O\u00c7",
  "o\u00e7",
  "o. \u00e7ocu\u011fu",
  "o\u011flan",
  "o\u011flanc\u0131",
  "o\u011flu it",
  "orosbucocuu",
  "orospu",
  "orospucocugu",
  "orospu cocugu",
  "orospu \u00e7oc",
  "orospu\u00e7ocu\u011fu",
  "orospu \u00e7ocu\u011fu",
  "orospu \u00e7ocu\u011fudur",
  "orospu \u00e7ocuklar\u0131",
  "orospudur",
  "orospular",
  "orospunun",
  "orospunun evlad\u0131",
  "orospuydu",
  "orospuyuz",
  "orostoban",
  "orostopol",
  "orrospu",
  "oruspu",
  "oruspu\u00e7ocu\u011fu",
  "oruspu \u00e7ocu\u011fu",
  "osbir",
  "ossurduum",
  "ossurmak",
  "ossuruk",
  "osur",
  "osurduu",
  "osuruk",
  "osururum",
  "otuzbir",
  "\u00f6k\u00fcz",
  "\u00f6\u015fex",
  "patlak zar",
  "penis",
  "pezevek",
  "pezeven",
  "pezeveng",
  "pezevengi",
  "pezevengin evlad\u0131",
  "pezevenk",
  "pezo",
  "pic",
  "pici",
  "picler",
  "pi\u00e7",
  "pi\u00e7in o\u011flu",
  "pi\u00e7 kurusu",
  "pi\u00e7ler",
  "pipi",
  "pipi\u015f",
  "pisliktir",
  "porno",
  "pussy",
  "pu\u015ft",
  "pu\u015fttur",
  "rahminde",
  "revizyonist",
  "s1kerim",
  "s1kerm",
  "s1krm",
  "sakso",
  "saksofon",
  "salaak",
  "salak",
  "saxo",
  "sekis",
  "serefsiz",
  "sevgi koyar\u0131m",
  "sevi\u015felim",
  "sexs",
  "s\u0131\u00e7ar\u0131m",
  "s\u0131\u00e7t\u0131\u011f\u0131m",
  "s\u0131ecem",
  "sicarsin",
  "sie",
  "sik",
  "sikdi",
  "sikdi\u011fim",
  "sike",
  "sikecem",
  "sikem",
  "siken",
  "sikenin",
  "siker",
  "sikerim",
  "sikerler",
  "sikersin",
  "sikertir",
  "sikertmek",
  "sikesen",
  "sikesicenin",
  "sikey",
  "sikeydim",
  "sikeyim",
  "sikeym",
  "siki",
  "sikicem",
  "sikici",
  "sikien",
  "sikienler",
  "sikiiim",
  "sikiiimmm",
  "sikiim",
  "sikiir",
  "sikiirken",
  "sikik",
  "sikil",
  "sikildiini",
  "sikilesice",
  "sikilmi",
  "sikilmie",
  "sikilmis",
  "sikilmi\u015f",
  "sikilsin",
  "sikim",
  "sikimde",
  "sikimden",
  "sikime",
  "sikimi",
  "sikimiin",
  "sikimin",
  "sikimle",
  "sikimsonik",
  "sikimtrak",
  "sikin",
  "sikinde",
  "sikinden",
  "sikine",
  "sikini",
  "sikip",
  "sikis",
  "sikisek",
  "sikisen",
  "sikish",
  "sikismis",
  "siki\u015f",
  "siki\u015fen",
  "siki\u015fme",
  "sikitiin",
  "sikiyim",
  "sikiym",
  "sikiyorum",
  "sikkim",
  "sikko",
  "sikleri",
  "sikleriii",
  "sikli",
  "sikm",
  "sikmek",
  "sikmem",
  "sikmiler",
  "sikmisligim",
  "siksem",
  "sikseydin",
  "sikseyidin",
  "siksin",
  "siksinbaya",
  "siksinler",
  "siksiz",
  "siksok",
  "siksz",
  "sikt",
  "sikti",
  "siktigimin",
  "siktigiminin",
  "sikti\u011fim",
  "sikti\u011fimin",
  "sikti\u011fiminin",
  "siktii",
  "siktiim",
  "siktiimin",
  "siktiiminin",
  "siktiler",
  "siktim",
  "siktim",
  "siktimin",
  "siktiminin",
  "siktir",
  "siktir et",
  "siktirgit",
  "siktir git",
  "siktirir",
  "siktiririm",
  "siktiriyor",
  "siktir lan",
  "siktirolgit",
  "siktir ol git",
  "sittimin",
  "sittir",
  "skcem",
  "skecem",
  "skem",
  "sker",
  "skerim",
  "skerm",
  "skeyim",
  "skiim",
  "skik",
  "skim",
  "skime",
  "skmek",
  "sksin",
  "sksn",
  "sksz",
  "sktiimin",
  "sktrr",
  "skyim",
  "slaleni",
  "sokam",
  "sokar\u0131m",
  "sokarim",
  "sokarm",
  "sokarmkoduumun",
  "sokay\u0131m",
  "sokaym",
  "sokiim",
  "soktu\u011fumunun",
  "sokuk",
  "sokum",
  "soku\u015f",
  "sokuyum",
  "soxum",
  "sulaleni",
  "s\u00fclaleni",
  "s\u00fclalenizi",
  "s\u00fcrt\u00fck",
  "\u015ferefsiz",
  "\u015f\u0131ll\u0131k",
  "taaklarn",
  "taaklarna",
  "tarrakimin",
  "tasak",
  "tassak",
  "ta\u015fak",
  "ta\u015f\u015fak",
  "tipini s.k",
  "tipinizi s.keyim",
  "tiyniyat",
  "toplarm",
  "topsun",
  "toto\u015f",
  "vajina",
  "vajinan\u0131",
  "veled",
  "veledizina",
  "veled i zina",
  "verdiimin",
  "weled",
  "weledizina",
  "whore",
  "xikeyim",
  "yaaraaa",
  "yalama",
  "yalar\u0131m",
  "yalarun",
  "yaraaam",
  "yarak",
  "yaraks\u0131z",
  "yaraktr",
  "yaram",
  "yaraminbasi",
  "yaramn",
  "yararmorospunun",
  "yarra",
  "yarraaaa",
  "yarraak",
  "yarraam",
  "yarraam\u0131",
  "yarragi",
  "yarragimi",
  "yarragina",
  "yarragindan",
  "yarragm",
  "yarra\u011f",
  "yarra\u011f\u0131m",
  "yarra\u011f\u0131m\u0131",
  "yarraimin",
  "yarrak",
  "yarram",
  "yarramin",
  "yarraminba\u015f\u0131",
  "yarramn",
  "yarran",
  "yarrana",
  "yarrrak",
  "yavak",
  "yav\u015f",
  "yav\u015fak",
  "yav\u015fakt\u0131r",
  "yavu\u015fak",
  "y\u0131l\u0131\u015f\u0131k",
  "yilisik",
  "yogurtlayam",
  "yo\u011furtlayam",
  "yrrak",
  "z\u0131kk\u0131m\u0131m",
  "zibidi",
  "zigsin",
  "zikeyim",
  "zikiiim",
  "zikiim",
  "zikik",
  "zikim",
  "ziksiiin",
  "ziksiin",
  "zulliyetini",
  "zviyetini"
];

client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
    if (i) {
      if (küfür.some(word => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
        const embed = new Discord.MessageEmbed()
          .setColor("#ff7e00")
          .setDescription(
            `${nev.author} , **Ben varken küfürmü emteye çalıştın?**`
          )
          .addField("Küfür:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor("#ff7e00")
          .setDescription(`${nev.author} , **Mesajı editle küfür etmekmi?**`);
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then(msg =>
          msg.delete({
            timeout: 5000
          })
        );
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
  if (i) {
    if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
          msg.delete({
            timeout: 750
          });
          const embeds = new Discord.MessageEmbed()
            .setColor("#ff7e00")
            .setDescription(
              `<@${msg.author.id}> , **sunucu düzenini bozmaya çalışıyor ama MOSCOW izin vermiyor!**`
            );
          msg.channel.send(embeds).then(msg =>
            msg.delete({
              timeout: 5000
            })
          );
          const embed = new Discord.MessageEmbed()
            .setColor("#ff7e00")
            .setDescription(
              `${msg.author} , **sunucu düzenini bozmaya çalışıyor ama MOSCOW izin vermiyor!**`
            )
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("message", msg => {
  if (!db.has(`reklam_${msg.guild.id}`)) return;
  const reklam = [
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https",
    "http",
    ".gl",
    ".org",
    ".com.tr",
    ".biz",
    "net",
    ".rf.gd",
    ".az",
    ".party",
    "discord.gg"
  ];
  if (reklam.some(word => msg.content.includes(word))) {
    try {
      if (!msg.member.hasPermission("BAN_MEMBERS")) {
        msg.delete();
        return msg
          .reply(
            "**Bu Sunucuda** `Reklam Engelle`** Aktif Reklam Yapmana İzin Vermem İzin Vermem ? !**"
          )
          .then(msg => msg.delete(3000));

        msg.delete(3000);
      }
    } catch (err) {
      console.log(err);
    }
  }
});

client.on("messageDelete", async message => {
  if (message.author.bot || !message.content) return;
  require("quick.db").push(message.guild.id, {
    author: message.author,
    authorTAG: message.author.tag,
    authorID: message.author.id,
    authorUSERNAME: message.author.username,
    authorDISCRIMINATOR: message.author.discriminator,
    messageID: message.id,
    messageCHANNEL: message.channel,
    messageCHANNELID: message.channel.id,
    messageCONTENT: message.content,
    messageCREATEDAT: message.createdAt
  });
});

client.on("guildBanRemove", (guild, user) => {
  const database = require("quick.db");
  const bans = database.get(`acilmayanBan.laura.${guild.id}`) || [];
  if (bans.some(ban => ban.user.id == user.id))
    return guild.members.ban(user, { reason: "Açılmayan Ban Sistemi." });
});

function afkSil(message, afk, isim) {
  message.channel.send(`${message.author} Artık **AFK** değilsiniz.`);
  db.delete(`afkSebep_${afk.id}_${message.guild.id}`);
  db.delete(`afkid_${afk.id}_${message.guild.id}`);
  db.delete(`afkAd_${afk.id}_${message.guild.id}`);
  db.delete(`afk_süre_${afk.id}_${message.guild.id}`);
  message.member.setNickname(isim);
}

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  var fd = false;
  var sdd = new Set();
  let afk = message.mentions.users;
  if (afk.first()) {
    afk.forEach(async afk => {
      if (sdd.has(afk.id)) return;
      else sdd.add(afk.id);
      var kisi = db.fetch(`afkid_${afk.id}_${message.guild.id}`);
      var kisi2 = db.fetch(`afkid_${message.member.id}_${message.guild.id}`);
      if (kisi) {
        var isim = db.fetch(`afkAd_${afk.id}_${message.guild.id}`);
        if (kisi2) {
          fd = true;
          afkSil(message, message.member, isim);
        }
        if (afk.id == message.member.id) {
          if (!fd) afkSil(message, afk, isim);
        }
        if (afk.id !== message.member.id) {
          var sebep = db.fetch(`afkSebep_${afk.id}_${message.guild.id}`);
          if (sebep) {
            let süre = await db.fetch(`afk_süre_${afk.id}_${message.guild.id}`);
            let timeObj = ms(Date.now() - süre);
            message.channel.send(`${afk} şu an da AFK!
Şu kadar süredir: ${timeObj.days} Gün, ${timeObj.hours} Saat, ${timeObj.minutes} Dakika, ${timeObj.seconds} Saniye
Sebep: ${sebep}`);
          }
        }
      } else {
        afk = message.member;
        kisi = db.fetch(`afkid_${message.member.id}_${message.guild.id}`);
        if (kisi) {
          var isim = db.fetch(`afkAd_${afk.id}_${message.guild.id}`);
          if (afk.id == message.member.id) {
            afkSil(message, afk, isim);
          }
          if (afk.id !== message.member.id) {
            var sebep = db.fetch(`afkSebep_${afk.id}_${message.guild.id}`);
            if (message.content.includes(kisi)) {
              if (sebep) {
                let süre = await db.fetch(
                  `afk_süre_${afk.id}_${message.guild.id}`
                );
                let timeObj = ms(Date.now() - süre);
                message.channel.send(`${afk} şu an da AFK!
Şu kadar süredir: ${timeObj.days} Gün, ${timeObj.hours} Saat, ${timeObj.minutes} Dakika, ${timeObj.seconds} Saniye
Sebep: ${sebep}`);
              }
            }
          }
        }
      }
    });
  } else {
    afk = message.member;
    var kisi = db.fetch(`afkid_${afk.id}_${message.guild.id}`);
    if (!kisi) return;
    var isim = db.fetch(`afkAd_${afk.id}_${message.guild.id}`);
    afkSil(message, afk, isim);
  }
});

client.on("guildMemberAdd", async member => {
  const sunucu = client.guilds.cache.get("852841324407422996"); //sunucu ıd
  const hoşgeldin_kanalı = client.channels.cache.get(859691708248490024); //mesajın gideceği kanal
  if (member.user.bot) return; // bota mesaj atmama kısmı
  await member.setNickname(`isim | yaş`); // oto isim kısmı
  const jahkyembed = new MessageEmbed()
    .setTitle(
      `**${sunucu.name} sunucumuza hoşgeldin tag alarak bize katılabilirsin**`
    )
    .setDescription(
      `
**${member} Seninle Birlikte ${sunucu.memberCount} Kişiyiz!**

**Kayıt Olmak için Yandaki V.Confirmed Odalarına Geçebilirsiniz**

**ywtkililwe sizinle ilgilenecektir beklemede kalın**
`
    )
    .setFooter("Moscow ❤ Wagner")
    .setImage(""); //görsel kısmı gif vesayle koyabilirsiniz sıkıntı çıkmıyor

  hoşgeldin_kanalı.send(jahkyembed);
  hoşgeldin_kanalı.send(
    `<@&kayıt yetkilisi> **${member} Katıldı Ona Yardımcı olun**`
  );
});

client.on("message", async message => {
  if (message.author.id === client.user.id) return;
  if (message.guild) return;
  client.channels.cache.get("859712561229725706").send(
    new Discord.MessageEmbed()
      .setAuthor("Bir Dm Geldi", client.user.avatarURL())
      .setFooter(message.author.tag, message.author.avatarURL())
      .setDescription(`**Gönderenin ID:** ${message.author.id}`)
      .setTimestamp()
      .addField("Mesaj", message.content)
      .setColor("RANDOM")
  );
});

const invites = {};
const wait = require("util").promisify(setTimeout);
client.on("ready", () => {
  wait(1000);
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on("guildMemberAdd", member => {
  if (member.user.bot) return;

  member.guild.fetchInvites().then(async guildInvites => {
    const ei = invites[member.guild.id];

    invites[member.guild.id] = guildInvites;

    const invite = await guildInvites.find(
      i => (ei.get(i.code) == null ? i.uses - 1 : ei.get(i.code).uses) < i.uses
    );

    const daveteden = member.guild.members.cache.get(invite.inviter.id);

    db.add(`davet_${invite.inviter.id}_${member.guild.id}`, +1);

    db.set(`bunudavet_${member.id}`, invite.inviter.id);

    let davetsayiv2 = await db.fetch(
      `davet_${invite.inviter.id}_${member.guild.id}`
    );

    let davetsayi;

    if (!davetsayiv2) davetsayi = 0;
    else
      davetsayi = await db.fetch(
        `davet_${invite.inviter.id}_${member.guild.id}`
      );
    let date = moment(member.user.createdAt);
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);

    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor(msecs / (1000 * 60));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;

    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`;
    else if (months > 0)
      string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`;
    else if (weeks > 0)
      string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`;
    else if (days > 0)
      string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`;
    else if (hours > 0)
      string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`;
    else if (mins > 0)
      string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`;
    else if (secs > 0) string += `${secs} saniye`;

    string = string.trim();

    let guild = member.client.guilds.cache.get(config.guildID);
    let log = guild.channels.cache.get(config.hgkanal);
    let endAt = member.user.createdAt;
    let gün = moment(new Date(endAt).toISOString()).format("DD");
    let ay = moment(new Date(endAt).toISOString())
      .format("MM")
      .replace("01", "Ocak")
      .replace("02", "Şubat")
      .replace("03", "Mart")
      .replace("04", "Nisan")
      .replace("05", "Mayıs")
      .replace("06", "Haziran")
      .replace("07", "Temmuz")
      .replace("08", "Ağustos")
      .replace("09", "Eylül")
      .replace("10", "Ekim")
      .replace("11", "Kasım")
      .replace("12", "Aralık");
    let yıl = moment(new Date(endAt).toISOString()).format("YYYY");
    let saat = moment(new Date(endAt).toISOString()).format("HH:mm");
    let kuruluş = `${gün} ${ay} ${yıl} ${saat}`;
    log.send(`
   ${member} Aramıza Hoşgeldin
   
   Hesabın **${kuruluş} (${string})** önce oluşturulmuş.
   
   Sunucu kurallarımız <#${config.kurallar}> kanalında yazıyor okumayı unutmayın. Unutma kayıt işlemi kuralları okuduğunu varsayarak gerçekleştirilecek.
         
   <@&${config.kayıtcıRolleri}> Seninle ilgilenicektir.
   
   Seninle birlikte **${member.guild.memberCount}** üyeye ulaştık! İyi Eğlenceler. :tada::tada:
   Davet eden ${daveteden} (Toplam Davet ${davetsayi})`);
  });
});
client.on("guildMemberRemove", async member => {
  let davetçi = await db.fetch(`bunudavet_${member.id}`);

  const daveteden = member.guild.members.cache.get(davetçi);

  db.add(`davet_${davetçi}_${member.guild.id}`, -1);
});

//////////////////////////////////////////////////
//                                              //
//      kodlar Yermolai tarafından yapıldı      //
//                                              //
//                                              //
//  böyle yapmamın sebebi bir youtuberda gördüm //                                     //
//                                              //
//////////////////////////////////////////////////

// buraya bot tokeninizi yazacaksınız veya ayarlar.json ' u etiketliyeceksiniz //

client.login(process.env.token);
