// Enquiry follow-up (2026-11-21):
// 1. An automatic "we received your request" email to the visitor, in the website language
//    they used (12 languages), with WhatsApp and the opening hours. To keep it from being
//    used to send spam to other people, it never repeats what the visitor typed (no message,
//    no stone names): only a cleaned first name and the request type.
// 2. A daily email to the company inbox (ZOHO_EMAIL, where the enquiries arrive) listing the
//    enquiries still "New" after 2 days, once a day after 9:00 Cairo time. Two server
//    machines can't both send it: the day is claimed in site_meta/news (`followupDigestOn`).
// Never from staging.

const nodemailer = require('nodemailer');
const { db } = require('../start/firebase');
const { col, IS_STAGING } = require('../start/data-area');

const ADMIN_URL = 'https://admin.wadidegla-eg.com/enquiries';
const SITE = 'https://www.wadidegla-eg.com';
const DEFAULTS = { whatsappUrl: 'https://wa.me/message/LAQ57AMNJ5ZON1?src=qr', mainPhone: '+20 10 6726 0314' };
const OLDER_THAN_MS = 2 * 24 * 3600 * 1000;

let transporter;
const mailer = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_PASSWORD },
    });
  }
  return transporter;
};
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Company phone / WhatsApp, with the client's admin-panel changes (block `company`).
async function contact() {
  try {
    const doc = await db.collection(col('site_content')).doc('company').get();
    return { ...DEFAULTS, ...(doc.exists ? doc.data()?.data || {} : {}) };
  } catch {
    return DEFAULTS;
  }
}

// Only letters, spaces and . - ' (no links or symbols), first 40 characters.
const cleanName = (name) =>
  String(name || '')
    .replace(/[^\p{L}\p{M} .'-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40);

// {name} / {what}: the request type. Texts follow the website's own wording.
const T = {
  en: {
    subject: 'We received your request – Wadi Degla',
    hello: 'Hello {name},',
    helloAnon: 'Hello,',
    got: 'Thank you for contacting Wadi Degla. We received your {what} and our export team will reply by email as soon as possible.',
    contact: 'Your message',
    sample: 'sample request',
    quote: 'quote request',
    hours: 'Our office hours are Saturday to Thursday, 9:00–17:00 (Cairo time).',
    wa: 'For a faster answer you can also message us on WhatsApp:',
    bye: 'Best regards,',
    team: 'Wadi Degla export team',
    auto: 'This is an automatic confirmation; you can reply to this email if you want to add anything.',
  },
  ar: {
    subject: 'استلمنا طلبك – وادي دجلة',
    hello: 'مرحبًا {name}،',
    helloAnon: 'مرحبًا،',
    got: 'شكرًا لتواصلك مع وادي دجلة. استلمنا {what} وسيرد عليك فريق التصدير بالبريد الإلكتروني في أقرب وقت.',
    contact: 'رسالتك',
    sample: 'طلب العينة',
    quote: 'طلب عرض السعر',
    hours: 'مواعيد العمل من السبت إلى الخميس، من 9:00 إلى 17:00 (بتوقيت القاهرة).',
    wa: 'وللرد بشكل أسرع يمكنك مراسلتنا على واتساب:',
    bye: 'مع أطيب التحيات،',
    team: 'فريق التصدير – وادي دجلة',
    auto: 'هذه رسالة تأكيد تلقائية، ويمكنك الرد عليها إذا أردت إضافة أي شيء.',
  },
  fr: {
    subject: 'Nous avons reçu votre demande – Wadi Degla',
    hello: 'Bonjour {name},',
    helloAnon: 'Bonjour,',
    got: 'Merci d’avoir contacté Wadi Degla. Nous avons reçu {what} et notre équipe export vous répondra par e-mail dès que possible.',
    contact: 'votre message',
    sample: 'votre demande d’échantillon',
    quote: 'votre demande de devis',
    hours: 'Nos bureaux sont ouverts du samedi au jeudi, de 9h00 à 17h00 (heure du Caire).',
    wa: 'Pour une réponse plus rapide, écrivez-nous aussi sur WhatsApp :',
    bye: 'Cordialement,',
    team: 'L’équipe export de Wadi Degla',
    auto: 'Ceci est une confirmation automatique ; vous pouvez répondre à cet e-mail pour ajouter une information.',
  },
  es: {
    subject: 'Hemos recibido su solicitud – Wadi Degla',
    hello: 'Hola {name}:',
    helloAnon: 'Hola:',
    got: 'Gracias por contactar con Wadi Degla. Hemos recibido {what} y nuestro equipo de exportación le responderá por correo lo antes posible.',
    contact: 'su mensaje',
    sample: 'su solicitud de muestra',
    quote: 'su solicitud de presupuesto',
    hours: 'Nuestro horario es de sábado a jueves, de 9:00 a 17:00 (hora de El Cairo).',
    wa: 'Para una respuesta más rápida, también puede escribirnos por WhatsApp:',
    bye: 'Saludos cordiales,',
    team: 'Equipo de exportación de Wadi Degla',
    auto: 'Esta es una confirmación automática; puede responder a este correo si desea añadir algo.',
  },
  de: {
    subject: 'Wir haben Ihre Anfrage erhalten – Wadi Degla',
    hello: 'Hallo {name},',
    helloAnon: 'Hallo,',
    got: 'Vielen Dank für Ihre Nachricht an Wadi Degla. Wir haben {what} erhalten, und unser Exportteam antwortet Ihnen so bald wie möglich per E-Mail.',
    contact: 'Ihre Nachricht',
    sample: 'Ihre Musteranfrage',
    quote: 'Ihre Angebotsanfrage',
    hours: 'Unsere Bürozeiten: Samstag bis Donnerstag, 9:00–17:00 Uhr (Kairoer Zeit).',
    wa: 'Für eine schnellere Antwort schreiben Sie uns auch gern auf WhatsApp:',
    bye: 'Mit freundlichen Grüßen',
    team: 'Ihr Exportteam von Wadi Degla',
    auto: 'Dies ist eine automatische Bestätigung; Sie können auf diese E-Mail antworten, um etwas zu ergänzen.',
  },
  it: {
    subject: 'Abbiamo ricevuto la sua richiesta – Wadi Degla',
    hello: 'Buongiorno {name},',
    helloAnon: 'Buongiorno,',
    got: 'Grazie per aver contattato Wadi Degla. Abbiamo ricevuto {what} e il nostro team export le risponderà via e-mail il prima possibile.',
    contact: 'il suo messaggio',
    sample: 'la sua richiesta di campione',
    quote: 'la sua richiesta di preventivo',
    hours: 'Il nostro orario è da sabato a giovedì, 9:00–17:00 (ora del Cairo).',
    wa: 'Per una risposta più rapida può scriverci anche su WhatsApp:',
    bye: 'Cordiali saluti,',
    team: 'Il team export di Wadi Degla',
    auto: 'Questa è una conferma automatica; può rispondere a questa e-mail per aggiungere qualcosa.',
  },
  ro: {
    subject: 'Am primit solicitarea dvs. – Wadi Degla',
    hello: 'Bună ziua, {name},',
    helloAnon: 'Bună ziua,',
    got: 'Vă mulțumim că ați contactat Wadi Degla. Am primit {what}, iar echipa noastră de export vă va răspunde pe e-mail cât mai curând.',
    contact: 'mesajul dvs.',
    sample: 'cererea dvs. de mostră',
    quote: 'cererea dvs. de ofertă',
    hours: 'Programul nostru este de sâmbătă până joi, 9:00–17:00 (ora Cairo).',
    wa: 'Pentru un răspuns mai rapid ne puteți scrie și pe WhatsApp:',
    bye: 'Cu stimă,',
    team: 'Echipa de export Wadi Degla',
    auto: 'Aceasta este o confirmare automată; puteți răspunde la acest e-mail dacă doriți să adăugați ceva.',
  },
  ko: {
    subject: '요청을 접수했습니다 – Wadi Degla',
    hello: '{name}님, 안녕하세요.',
    helloAnon: '안녕하세요.',
    got: 'Wadi Degla에 연락해 주셔서 감사합니다. {what}을(를) 접수했으며, 수출팀이 가능한 한 빨리 이메일로 답변드리겠습니다.',
    contact: '보내주신 메시지',
    sample: '샘플 요청',
    quote: '견적 요청',
    hours: '근무 시간은 토요일~목요일, 9:00–17:00(카이로 시간)입니다.',
    wa: '더 빠른 답변을 원하시면 WhatsApp으로도 연락 주세요:',
    bye: '감사합니다.',
    team: 'Wadi Degla 수출팀',
    auto: '자동 확인 메일입니다. 추가할 내용이 있으면 이 메일에 회신해 주세요.',
  },
  sq: {
    subject: 'Kërkesa juaj u mor – Wadi Degla',
    hello: 'Përshëndetje {name},',
    helloAnon: 'Përshëndetje,',
    got: 'Faleminderit që kontaktuat Wadi Degla. E morëm {what} dhe ekipi ynë i eksportit do t’ju përgjigjet me e-mail sa më shpejt.',
    contact: 'mesazhin tuaj',
    sample: 'kërkesën tuaj për mostër',
    quote: 'kërkesën tuaj për ofertë',
    hours: 'Orari ynë është e shtunë deri të enjte, 9:00–17:00 (ora e Kajros).',
    wa: 'Për një përgjigje më të shpejtë mund të na shkruani edhe në WhatsApp:',
    bye: 'Me respekt,',
    team: 'Ekipi i eksportit Wadi Degla',
    auto: 'Ky është një konfirmim automatik; mund t’i përgjigjeni këtij e-maili nëse doni të shtoni diçka.',
  },
  ru: {
    subject: 'Мы получили ваш запрос – Wadi Degla',
    hello: 'Здравствуйте, {name}!',
    helloAnon: 'Здравствуйте!',
    got: 'Спасибо, что обратились в Wadi Degla. Мы получили {what}, и наш экспортный отдел ответит вам по электронной почте как можно скорее.',
    contact: 'ваше сообщение',
    sample: 'ваш запрос образца',
    quote: 'ваш запрос цены',
    hours: 'Мы работаем с субботы по четверг, 9:00–17:00 (по каирскому времени).',
    wa: 'Чтобы получить ответ быстрее, напишите нам также в WhatsApp:',
    bye: 'С уважением,',
    team: 'Экспортный отдел Wadi Degla',
    auto: 'Это автоматическое подтверждение; вы можете ответить на это письмо, если хотите что-то добавить.',
  },
  ja: {
    subject: 'お問い合わせを受け付けました – Wadi Degla',
    hello: '{name} 様',
    helloAnon: 'お客様',
    got: 'Wadi Degla にお問い合わせいただきありがとうございます。{what}を受け付けました。輸出チームよりできるだけ早くメールでご返信いたします。',
    contact: 'メッセージ',
    sample: 'サンプルのご依頼',
    quote: 'お見積りのご依頼',
    hours: '営業時間は土曜日〜木曜日、9:00〜17:00（カイロ時間）です。',
    wa: 'お急ぎの場合は WhatsApp でもご連絡いただけます：',
    bye: 'よろしくお願いいたします。',
    team: 'Wadi Degla 輸出チーム',
    auto: 'これは自動送信の確認メールです。追加のご連絡はこのメールに返信してください。',
  },
  zh: {
    subject: '我们已收到您的请求 – Wadi Degla',
    hello: '{name}，您好：',
    helloAnon: '您好：',
    got: '感谢您联系 Wadi Degla。我们已收到您的{what}，我们的出口团队会尽快通过电子邮件回复您。',
    contact: '留言',
    sample: '样品申请',
    quote: '询价请求',
    hours: '我们的工作时间为周六至周四 9:00–17:00（开罗时间）。',
    wa: '如需更快回复，也可以通过 WhatsApp 联系我们：',
    bye: '此致',
    team: 'Wadi Degla 出口团队',
    auto: '这是一封自动确认邮件；如需补充信息，请直接回复此邮件。',
  },
};

const FollowUp = {};

// After a saved enquiry. Never throws.
FollowUp.autoReply = async ({ to, name, lang, kind }) => {
  if (IS_STAGING || !process.env.ZOHO_EMAIL || !to) return false;
  const t = T[lang] || T.en;
  const first = cleanName(name).split(' ')[0];
  const what = t[kind] || t.contact;
  const c = await contact();
  const rtl = lang === 'ar';
  const lines = [first ? t.hello.replace('{name}', first) : t.helloAnon, t.got.replace('{what}', what), t.hours, t.wa];
  const html = `<div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222">
${lines.map((l) => `<p>${esc(l)}</p>`).join('\n')}
<p><a href="${esc(c.whatsappUrl)}">WhatsApp</a> · ${esc(c.mainPhone)} · <a href="${SITE}/${T[lang] ? lang : 'en'}/">wadidegla-eg.com</a></p>
<p>${esc(t.bye)}<br>${esc(t.team)}</p>
<p style="color:#888;font-size:12px">${esc(t.auto)}</p></div>`;
  const text = [...lines, `${c.whatsappUrl}  ·  ${c.mainPhone}`, '', t.bye, t.team, '', t.auto].join('\n');
  try {
    await mailer().sendMail({
      from: `"Wadi Degla" <${process.env.ZOHO_EMAIL}>`,
      to,
      replyTo: process.env.ZOHO_EMAIL,
      subject: t.subject,
      text,
      html,
      headers: { 'Auto-Submitted': 'auto-replied' },
    });
    return true;
  } catch (e) {
    console.error('[followup] auto-reply not sent:', e.message);
    return false;
  }
};

const KIND = { contact: 'Contact form', sample: 'Sample request', quote: 'Quote request' };
const cairoNow = () => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
};

// The enquiries still "New" after 2 days (oldest first).
FollowUp.waiting = async () => {
  const snap = await db.collection(col('enquiries')).where('status', '==', 'new').limit(500).get();
  const limit = Date.now() - OLDER_THAN_MS;
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((e) => e.createdAt && e.createdAt < limit)
    .sort((a, b) => a.createdAt - b.createdAt);
};

FollowUp.digestText = (list) => {
  const fmt = (ms) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Cairo' });
  const days = (ms) => Math.floor((Date.now() - ms) / (24 * 3600 * 1000));
  return [
    `${list.length} website ${list.length === 1 ? 'enquiry is' : 'enquiries are'} still marked "New" after 2 days or more:`,
    '',
    ...list.map(
      (e) =>
        `- ${fmt(e.createdAt)} (${days(e.createdAt)} days) · ${KIND[e.kind] || 'Enquiry'} · ${e.name || ''}${e.company ? ` (${e.company})` : ''}${e.country ? ` · ${e.country}` : ''} · ${e.email || ''}`,
    ),
    '',
    `Answer them, then mark each one Replied / Won / Lost / Spam in the admin panel: ${ADMIN_URL}`,
    '',
    '(Automatic daily reminder from the Wadi Degla website. It stops when nothing is waiting.)',
  ].join('\n');
};

// Checks every 30 minutes; sends at most one reminder per Cairo day, after 9:00.
async function maybeSendDigest() {
  const { day, hour } = cairoNow();
  if (hour < 9) return;
  const metaRef = db.collection(col('site_meta')).doc('news');
  const claimed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(metaRef);
    if (snap.exists && snap.data()?.followupDigestOn === day) return false;
    tx.set(metaRef, { followupDigestOn: day }, { merge: true });
    return true;
  });
  if (!claimed) return;
  const list = await FollowUp.waiting();
  if (!list.length) return;
  await mailer().sendMail({
    from: `"Wadi Degla Website" <${process.env.ZOHO_EMAIL}>`,
    to: process.env.ZOHO_EMAIL,
    subject: `[Reminder] ${list.length} website ${list.length === 1 ? 'enquiry' : 'enquiries'} waiting for an answer`,
    text: FollowUp.digestText(list),
  });
  console.log(`[followup] daily reminder sent (${list.length} waiting)`);
}

FollowUp.startDailyReminder = () => {
  if (IS_STAGING || !process.env.ZOHO_EMAIL) return;
  const run = () => maybeSendDigest().catch((e) => console.error('[followup] reminder failed:', e.message));
  setTimeout(run, 3 * 60 * 1000).unref();
  setInterval(run, 30 * 60 * 1000).unref();
};

FollowUp.TEXTS = T;
FollowUp.sendDigestNow = maybeSendDigest; // for tests
module.exports = FollowUp;
