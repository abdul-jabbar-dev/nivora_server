import { Injectable, Logger } from '@nestjs/common';
import { ENV } from '../env.js';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  /**
   * Send WhatsApp notification when a new order is placed.
   * Sends both the template message (guaranteed 24/7 delivery)
   * and an itemized text summary.
   */
  async sendOrderNotification(order: any): Promise<void> {
    const adminNumber = ENV.WHATSAPP.ADMIN_NUMBER?.replace(/[^0-9]/g, '');
    const accessToken = ENV.WHATSAPP.ACCESS_TOKEN;
    const phoneNumberId = ENV.WHATSAPP.PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId || !adminNumber) {
      this.logger.warn(
        'WhatsApp credentials or admin number not fully configured. Skipping notification.',
      );
      return;
    }

    const customerName =
      [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') ||
      order.phoneNumber ||
      'Customer';

    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    );

    const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;

    // 1. Send Template message
    try {
      await this.sendTemplateMessage({
        to: adminNumber,
        templateName: ENV.WHATSAPP.TEMPLATE_NAME,
        parameters: [customerName, orderRef, orderDate],
      });
      this.logger.log(`WhatsApp template notification sent for order ${order.id}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to send WhatsApp template message for order ${order.id}: ${err.message}`,
        err.stack,
      );
    }

    // 2. Attempt detailed order breakdown text message
    try {
      const itemsList =
        order.items && order.items.length > 0
          ? order.items
            .map((item: any, idx: number) => {
              const name = item.product?.name || `Item ${idx + 1}`;
              return `• ${name} x ${item.quantity} - ৳${item.price * item.quantity}`;
            })
            .join('\n')
          : '• Order items recorded in dashboard';

      const shippingLabel =
        order.shippingMethod === 'sameday'
          ? 'Same Day Delivery'
          : 'Standard Delivery';

      const paymentInfo = [
        order.paymentMethod || 'Cash on Delivery',
        order.bkashNumber ? `(bKash: ${order.bkashNumber})` : null,
        order.trxId ? `(TrxID: ${order.trxId})` : null,
      ]
        .filter(Boolean)
        .join(' ');

      const addressLines = [
        order.address,
        order.city ? `${order.city} ${order.zip || ''}`.trim() : null,
        order.landmark ? `(Landmark: ${order.landmark})` : null,
      ]
        .filter(Boolean)
        .join(', ');

      const textMessage = `🛒 *NEW ORDER RECEIVED!*
━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${order.id} (${orderRef})
👤 *Customer:* ${customerName}
📞 *Phone:* ${order.phoneNumber || order.user?.phoneNumber || 'N/A'}
📍 *Address:* ${addressLines || 'N/A'}

📦 *Items Ordered:*
${itemsList}

🚚 *Shipping:* ${shippingLabel}
💳 *Payment:* ${paymentInfo}
💰 *Total Amount:* ৳${order.total}
━━━━━━━━━━━━━━━━━━`;

      await this.sendTextMessage(adminNumber, textMessage);
      this.logger.log(`WhatsApp detailed text summary sent for order ${order.id}`);
    } catch (err: any) {
      // Detailed text message might fail if 24h conversation window is closed, which is expected by Meta policy
      this.logger.warn(
        `WhatsApp detailed text message not delivered (24h customer window policy): ${err.message}`,
      );
    }
  }

  /**
   * Low-level method to send a template message
   */
  async sendTemplateMessage(options: {
    to: string;
    templateName: string;
    parameters: string[];
    languageCode?: string;
  }): Promise<any> {
    const url = `${ENV.WHATSAPP.API_URL}/${ENV.WHATSAPP.PHONE_NUMBER_ID}/messages`;

    const bodyParameters = options.parameters.map((param) => ({
      type: 'text',
      text: param,
    }));

    const payload = {
      messaging_product: 'whatsapp',
      to: options.to,
      type: 'template',
      template: {
        name: options.templateName,
        language: { code: options.languageCode || 'en_US' },
        components: [
          {
            type: 'body',
            parameters: bodyParameters,
          },
        ],
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error?.message || `WhatsApp API error (${res.status})`);
    }

    return data;
  }

  /**
   * Low-level method to send a free-form text message
   */
  async sendTextMessage(to: string, text: string): Promise<any> {
    const url = `${ENV.WHATSAPP.API_URL}/${ENV.WHATSAPP.PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error?.message || `WhatsApp API error (${res.status})`);
    }

    return data;
  }
}
