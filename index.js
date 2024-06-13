const { default: axios, formToJSON } = require("axios");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { link } = require("telegraf/format");
const bot = new Telegraf("7316246406:AAHejBxzyGXueqVRl7Bnje5KSgaNfxBLgt0");

const admin = "841886966";

const birKanalId = "2170125742"; //kinolar olami
const ikkiKanalId = "2148727314"; //kinolar kod
const uchKanalId = "841886966";
const tortKanalId = "841886966";

const birKanalLink = "https://t.me/+VN-ztexrJJRlN2Ri"; //kinolar olami
const ikkiKanalLink = "https://t.me/+afKKg9NW_Pk5YTUy"; //kinolar kod
const uchKanalLink = "841886966";
const tortKanalLink = "841886966";

const apiBaseUrl =
  "https://api.airtable.com/v0/app1ddXNg72FQrl4E/tblM82G0voQ6LGOiw";
const apiCode =
  "patdGIsCaU7hT4Cb0.18bf5b02fda3faa8f4bc563a8f9dafb567624a6e356e1a81ef2d699d3948db45";

const fetchAllRecords = async () => {
  console.log("boshlandi");
  let records = [];
  let offset = null;

  do {
    const params = offset ? { offset } : {};
    const response = await axios.get(apiBaseUrl, {
      headers: { Authorization: `Bearer ${apiCode}` },
      params,
    });

    records = records.concat(response.data.records);
    offset = response.data.offset;
  } while (offset);

  return records;
};
let kinolar = [];

const addMovie = async () => {
  const movies = await fetchAllRecords();
  console.log("done");
  console.log(movies);
  kinolar = [];
  movies.forEach((mov) => {
    kinolar.push({ id: mov.fields.id, link: mov.fields.link });
  });
  console.log("kinolar qo'shildi");
  bot.telegram.sendMessage(admin, "Kinolar qoshildi");
};

addMovie();

const isMemberFunc = async (ctx) => {
  const id = ctx.chat.id;

  const member = await ctx.telegram
    .getChatMember(`-100${birKanalId}`, id)
    .then((s) => s.status)
    .catch((e) => console.log(e));

  const member1 = await ctx.telegram
    .getChatMember(`-100${ikkiKanalId}`, id)
    .then((s) => s.status)
    .catch((e) => console.log(e));

  //   const member2 = await ctx.telegram
  //     .getChatMember(`-100${channel2}`, id)
  //     .then((s) => s.status)
  //     .catch((e) => console.log(e));

  if (member == "creator" || member == "member") {
    if (member1 == "creator" || member1 == "member") {
      if (member == "creator" || member == "member") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const majburiyKeyboard = [
  [{ text: "Birinchi kanal 📢", url: birKanalLink }],
  [{ text: "Ikkinchi kanal 📢", url: ikkiKanalLink }],
  [{ text: "Tekshirish", callback_data: "check" }],
];

bot.start(async (ctx) => {
  const azo = await isMemberFunc(ctx);
  if (!azo) {
    try {
      ctx.reply(
        "Iltimos botdan to'liq foydalanish uchun , quyidagi kanallarga a'zo bo'ishingizni so'raymiz",
        { reply_markup: { inline_keyboard: majburiyKeyboard } }
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      ctx.reply(
        "Ushbu bot orqali bemalol kinolarni topishingiz mumkin 🎬 Xohlagan kinoni kodini kiriting 👇"
      );
    } catch (e) {
      console.log(e);
    }
  }
});

bot.on("callback_query", async (ctx) => {
  if (ctx.callbackQuery.data == "check") {
    const azo = await isMemberFunc(ctx);
    if (!azo) {
      try {
        ctx.reply(
          "Iltimos botdan to'liq foydalanish uchun , quyidagi kanallarga a'zo bo'ishingizni so'raymiz",
          { reply_markup: { inline_keyboard: majburiyKeyboard } }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        ctx.reply(
          "Ushbu bot orqali bemalol kinolarni topishingiz mumkin 🎬 Xohlagan kinoni kodini kiriting 👇"
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
});
bot.command("kino_qosh", async (ctx) => {
  if (ctx.chat.id == admin) {
    addMovie();
  }
});

bot.on("text", async (ctx) => {
  textId = ctx.message.text;
  console.log(Number(textId) !== NaN);
  if (typeof Number(textId) == "number" && textId.length < 4) {
    let kinoBormi = false;
    kinolar.forEach(async (kino) => {
      if (kino.id == textId) {
        kinoBormi = true;
        try {
          await ctx.replyWithVideo(kino.link);
        } catch (e) {
          console.log(e);
        }
      }
    });
    console.log(kinoBormi);
    if (!kinoBormi) {
      try {
        await ctx.reply("Afsuski siz qidirgan kino topilmadi 😔");
      } catch (e) {
        console.log(e);
      }
    }
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
