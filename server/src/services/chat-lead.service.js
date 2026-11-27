const nodemailer = require('nodemailer');
const { IS_STAGING } = require('../start/data-area');
const EnquiriesService = require('./enquiries.service');
const FollowUp = require('./followup.service');
const Alerts = require('./alerts.service');

// A quote / sample request collected by the chat assistant and confirmed by the visitor
// (POST /api/chat/lead): saved in the Enquiries inbox first (so it is never lost), then
// emailed to the company inbox like the website forms (sendEmail.js), and the visitor gets the
// usual automatic "we received your request" email when they gave an email address.

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_PASSWORD },
});

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const row = (label, value) =>
  value
    ? `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(label)}</td><td style="padding:4px 0">${esc(value)}</td></tr>`
    : '';

function emailHtml(doc) {
  const items = doc.items
    .map((i) => `<li>${esc([i.name, i.finish, i.size, i.thickness, i.quantity].filter(Boolean).join(' – '))}</li>`)
    .join('');
  const wa = doc.whatsapp ? `https://wa.me/${doc.whatsapp.replace(/\D/g, '')}` : '';
  return `
    <p><strong>${doc.kind === 'sample' ? 'Sample request' : 'Quote request'} from the website chat assistant</strong></p>
    <table>
      ${row('Name', doc.name)}
      ${row('Company', doc.company)}
      ${row('Email', doc.email)}
      ${row('WhatsApp', doc.whatsapp)}
      ${row('Destination', doc.port)}
      ${row('Shipping address', doc.address)}
      ${row('Project', doc.projectType)}
      ${row('Page', doc.page)}
    </table>
    ${items ? `<p><strong>Stones:</strong></p><ul>${items}</ul>` : ''}
    ${wa ? `<p><a href="${esc(wa)}">Reply on WhatsApp</a></p>` : ''}
    <p><strong>Conversation:</strong></p>
    <p style="white-space:pre-wrap;color:#444">${esc(doc.message)}</p>
    <p style="color:#888">Also in the admin panel → Enquiries.</p>`;
}

async function send({ lead, transcript, lang, page, source }) {
  const { id, doc } = await EnquiriesService.saveChat({ lead, transcript, lang, page, source });
  const where = doc.port || doc.address || '';
  const subject = `New ${doc.kind} request (chat): ${doc.product || 'stone'}${where ? ` → ${where}` : ''}`.slice(0, 150);
  try {
    await transporter.sendMail({
      from: `"Wadi Degla Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      ...(doc.email ? { replyTo: doc.email } : {}),
      subject: IS_STAGING ? `[STAGING TEST] ${subject}` : subject,
      html: emailHtml(doc),
    });
    await EnquiriesService.markEmail(id, true).catch(() => {});
  } catch (error) {
    console.error('[chat] lead email error:', error.message);
    await EnquiriesService.markEmail(id, false).catch(() => {});
    Alerts.send('enquiry-email', 'A website enquiry could not be emailed', [
      'A visitor confirmed a request in the website chat, but the email to the company could not be sent.',
      'The request is saved: open the admin panel → Enquiries (it shows a warning sign).',
      `Email error: ${error.message}`,
    ]);
  }
  if (doc.email) FollowUp.autoReply({ to: doc.email, name: doc.name, lang: doc.lang, kind: doc.kind });
  return id;
}

module.exports = { send };
