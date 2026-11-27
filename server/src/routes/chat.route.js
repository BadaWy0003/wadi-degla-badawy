const express = require('express');
const Joi = require('joi');
const ChatService = require('../services/chat.service');
const ChatLead = require('../services/chat-lead.service');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { rateLimit } = require('../middlewares/rate-limit.middleware');
const validate = require('../middlewares/request-validator.middleware');

// Website chat assistant (chat.service.js). Public, so it is limited per visitor (IP):
// 20 messages a minute and 100 a day, 1,000 characters per message, the last 30 messages.
const router = express.Router();
const perMinute = rateLimit({ windowMs: 60 * 1000, max: 20 });
const perDay = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 100 });

const message = Joi.object({
  role: Joi.string().valid('user', 'assistant').required(),
  content: Joi.string().trim().min(1).max(1500).required(),
});
const chatSchema = {
  body: Joi.object({
    messages: Joi.array()
      .items(message)
      .min(1)
      .max(30)
      .required()
      .custom((list, helpers) => {
        const last = list[list.length - 1];
        if (last.role !== 'user' || last.content.length > 1000) return helpers.error('any.invalid');
        return list;
      }),
    lang: Joi.string()
      .valid(...ChatService.LANGS)
      .default('en'),
    page: Joi.string().max(200).allow(''),
    stone: Joi.string().max(80).allow(''),
    website: Joi.string().allow('').max(200), // honeypot: real visitors never fill it
  }).required(),
};

router.get('/status', async (req, res) => {
  try {
    res.status(200).json({ data: await ChatService.status() });
  } catch (e) {
    res.status(200).json({ data: { available: false } });
  }
});

router.post('/', perMinute, perDay, validate(chatSchema), async (req, res) => {
  if (req.body.website) return res.status(200).json({ data: { reply: '', lead: null, stones: [] } });
  try {
    res.status(200).json({ data: await ChatService.reply(req.body) });
  } catch (e) {
    if (e.statusCode) return res.status(e.statusCode).json({ message: e.message, fallback: 'whatsapp' });
    // Groq refused or failed (every model): the website shows the WhatsApp button
    console.error('[chat] no answer:', e.message);
    return res.status(503).json({ message: 'Chat unavailable', fallback: 'whatsapp' });
  }
});

// A request the visitor confirmed in the chat (summary card → Confirm): saved in Enquiries and
// emailed (chat-lead.service.js). 5 per visitor per 15 minutes, like the website forms.
const leadLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
const leadSchema = {
  body: Joi.object({
    lead: Joi.object().unknown(true).required(),
    transcript: Joi.array().items(message).max(40).default([]),
    lang: Joi.string().valid(...ChatService.LANGS).default('en'),
    page: Joi.string().max(200).allow(''),
    source: Joi.alternatives(Joi.string().max(1000).allow(''), Joi.object().unknown(true)),
    website: Joi.string().allow('').max(200),
  }).required(),
};
router.post('/lead', leadLimit, validate(leadSchema), async (req, res) => {
  if (req.body.website) return res.status(200).json({ data: { ok: true } });
  const lead = ChatService.cleanLead(req.body.lead);
  if (!lead) return res.status(400).json({ message: 'A name and an email or WhatsApp number are needed.' });
  try {
    await ChatLead.send({ ...req.body, lead });
    return res.status(200).json({ data: { ok: true } });
  } catch (e) {
    console.error('[chat] lead not saved:', e.message);
    return res.status(500).json({ message: 'Could not send the request', fallback: 'whatsapp' });
  }
});

// Admin panel (ADMIN/SUPER_ADMIN): the on/off switch and how the free Groq allowance is doing.
router.get('/admin', adminAuth, authorize('ADMIN'), async (req, res) => {
  try {
    res.status(200).json({ data: await ChatService.status() });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put(
  '/admin',
  adminAuth,
  authorize('ADMIN'),
  validate({ body: Joi.object({ enabled: Joi.boolean().required() }).required() }),
  async (req, res) => {
    try {
      res.status(200).json({ data: await ChatService.setEnabled(req.body.enabled, req.user?.email || req.user?.id) });
    } catch (e) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

module.exports = router;
