const Discord = require("discord.js");

exports.run = (client, message) => {
  const EmbedNarcosCode = new Discord.MessageEmbed()

    .setColor("RANDOM")
    .setTitle("yardım")
    .setThumbnail("")
    .setDescription(
      `

**YARDIM**

> **.mute :** sureli mute atar
> **.ban :** etiketlediğiniz kişiyi banlar
> **.kick :** etiketlediğiniz kişiyi atar
> **.unban :** banladığınız kişinin id si ile banını açabilirsiniz
> **.kilit :** komutu kullandığınız kanalı kilitler
> **.kilitaç :** kilitlediğiniz kanalın kilidini açar
> **.küfürengel :** küfür engeli açar (komutu tekrar yazarsanız kapatır)
> **.küfürlog :** küfür eden kişinin ettiği küfürü belirlediğiniz log kanalına atar
> **.nuke :** komutu kullandığınız kanalı siler ve yenisini oluşturur böylece tüm mesajlar silinir
> **.sil :** belirlediğiniz miktar kadar mesaj siler
> **.poll :** herhangi birşey hakkında oylama yapar 
> **.reklamengel :** reklam engel açar veya kapatır
> **.aban :** açılmaz ban atar
> **.snipe :** en son atılan mesajları gösterir

`
    )

    .setFooter(client.user.username + "", client.user.avatarURL)
    .setTimestamp();

  return message.channel.send(EmbedNarcosCode).then;
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "yardım",
  description: "Botun Komut Listesini Gösterir!",
  usage: "yardım"
};
