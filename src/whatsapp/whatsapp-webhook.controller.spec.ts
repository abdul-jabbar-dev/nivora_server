import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { WhatsappWebhookController } from './whatsapp-webhook.controller.js';
import { WhatsappWebhookService } from './whatsapp-webhook.service.js';
import { ENV } from '../env.js';

describe('WhatsappWebhookController & WhatsappWebhookService', () => {
  let controller: WhatsappWebhookController;
  let service: WhatsappWebhookService;

  const mockVerifyToken = 'test_verify_token_123';
  const mockAppSecret = 'test_secret_abc123';

  beforeEach(() => {
    ENV.WHATSAPP.VERIFY_TOKEN = mockVerifyToken;
    ENV.WHATSAPP.APP_SECRET = mockAppSecret;

    service = new WhatsappWebhookService();
    controller = new WhatsappWebhookController(service);
  });

  const createMockResponse = () => {
    const res: any = {};
    res.statusCode = 200;
    res.body = null;
    res.status = vi.fn().mockImplementation((code: number) => {
      res.statusCode = code;
      return res;
    });
    res.send = vi.fn().mockImplementation((body: any) => {
      res.body = body;
      return res;
    });
    return res;
  };

  describe('GET /webhooks/whatsapp (Verification)', () => {
    it('should return 200 and raw challenge for valid verification token and mode', () => {
      const res = createMockResponse();
      const query = {
        'hub.mode': 'subscribe',
        'hub.verify_token': mockVerifyToken,
        'hub.challenge': '1158201444',
      };

      controller.verifyWebhook(query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith('1158201444');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('1158201444');
    });

    it('should handle nested hub object query parameters from extended query parsers', () => {
      const res = createMockResponse();
      const query = {
        hub: {
          mode: 'subscribe',
          verify_token: mockVerifyToken,
          challenge: '99887766',
        },
      };

      controller.verifyWebhook(query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith('99887766');
    });

    it('should return 403 Forbidden when verify token does not match', () => {
      const res = createMockResponse();
      const query = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong_token',
        'hub.challenge': '1158201444',
      };

      controller.verifyWebhook(query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.statusCode).toBe(403);
    });

    it('should return 403 Forbidden when hub.mode is not subscribe', () => {
      const res = createMockResponse();
      const query = {
        'hub.mode': 'unsubscribe',
        'hub.verify_token': mockVerifyToken,
        'hub.challenge': '1158201444',
      };

      controller.verifyWebhook(query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });
  });

  describe('POST /webhooks/whatsapp (Event Ingestion)', () => {
    it('should return 200 and EVENT_RECEIVED for valid whatsapp_business_account payload', () => {
      const res = createMockResponse();
      const req: any = {};
      const processSpy = vi.spyOn(service, 'processWebhookEvent');

      const payload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: '2828940924150871',
            changes: [
              {
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '1234567890',
                    phone_number_id: '1326593580541232',
                  },
                  contacts: [{ profile: { name: 'John' }, wa_id: '8801700000000' }],
                  messages: [
                    {
                      from: '8801700000000',
                      id: 'wamid.HBgTEST123',
                      timestamp: '1726210000',
                      text: { body: 'Hello' },
                      type: 'text',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      controller.handleWebhook(req, res, payload);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith('EVENT_RECEIVED');
      expect(processSpy).toBeDefined();
    });

    it('should return 404 Not Found for malformed or unknown object payload', () => {
      const res = createMockResponse();
      const req: any = {};
      const payload = {
        object: 'page',
        entry: [],
      };

      controller.handleWebhook(req, res, payload);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.statusCode).toBe(404);
    });

    it('should verify valid HMAC SHA256 signature when header is present', () => {
      const res = createMockResponse();
      const payload = {
        object: 'whatsapp_business_account',
        entry: [],
      };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const signature =
        'sha256=' +
        crypto.createHmac('sha256', mockAppSecret).update(rawBody).digest('hex');

      const req: any = { rawBody };

      controller.handleWebhook(req, res, payload, signature);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith('EVENT_RECEIVED');
    });

    it('should reject with 401 Unauthorized when signature does not match', () => {
      const res = createMockResponse();
      const payload = {
        object: 'whatsapp_business_account',
        entry: [],
      };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const invalidSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';

      const req: any = { rawBody };

      controller.handleWebhook(req, res, payload, invalidSignature);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('WhatsappWebhookService Event Processing', () => {
    it('should safely process status update events without throwing', () => {
      const statusPayload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: '2828940924150871',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  statuses: [
                    {
                      id: 'wamid.TEST1',
                      status: 'delivered',
                      timestamp: '1726210000',
                      recipient_id: '8801345861869',
                    },
                    {
                      id: 'wamid.TEST2',
                      status: 'failed',
                      timestamp: '1726210000',
                      recipient_id: '8801345861869',
                      errors: [{ code: 131047, title: 'Re-engagement message' }],
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      expect(() => service.processWebhookEvent(statusPayload)).not.toThrow();
    });
  });
});
