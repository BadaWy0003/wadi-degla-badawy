const express = require('express');
const Joi = require('joi');
const ChatService = require('../services/chat.service');
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

module.exports = router;
