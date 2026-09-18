export const FOUNDER_CONTACTS = {
  shoeb: {
    name: 'Shoeb Khan',
    role: 'Co-Founder & Operations',
    phone: '+91 70207 28378',
    whatsapp: '917020728378'
  },
  shan: {
    name: 'Shan Khan',
    role: 'Co-Founder & Creative Lead',
    phone: '+91 86053 37906',
    whatsapp: '918605337906'
  }
};

/**
 * Creates direct WhatsApp order link for a product
 */
export const createProductWhatsAppLink = ({
  product,
  selectedSize,
  selectedColor,
  customerName = '',
  customerCity = '',
  recipient = 'shoeb'
}) => {
  const number = FOUNDER_CONTACTS[recipient]?.whatsapp || FOUNDER_CONTACTS.shoeb.whatsapp;
  
  let message = `🔥 *NEW ORDER ENQUIRY - GANGSTER MENSWEAR* 🔥\n\n`;
  message += `Hey ${FOUNDER_CONTACTS[recipient]?.name || 'Bro'}! I want to order this drop:\n\n`;
  message += `👕 *Product:* ${product.title}\n`;
  message += `💰 *Offer Price:* ₹${product.price} (MRP: ~₹${product.mrp}~)\n`;
  message += `📏 *Selected Size:* ${selectedSize || product.sizes[0] || 'Standard'}\n`;
  message += `🎨 *Selected Color:* ${selectedColor || product.colors[0] || 'Standard'}\n`;
  message += `🏷️ *Category:* ${product.category} (${product.subCategory || 'Streetwear'})\n`;
  
  if (customerName) {
    message += `\n👤 *Customer Name:* ${customerName}\n`;
  }
  if (customerCity) {
    message += `📍 *Delivery Location:* ${customerCity}\n`;
  }

  message += `\nPlease confirm if this size is currently in stock & share payment details / COD confirmation! 🚀`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

/**
 * Creates WhatsApp message for an entire Cart
 */
export const createCartWhatsAppLink = ({
  items,
  totalAmount,
  customer,
  recipient = 'shoeb'
}) => {
  const number = FOUNDER_CONTACTS[recipient]?.whatsapp || FOUNDER_CONTACTS.shoeb.whatsapp;

  let message = `🔥 *MULTI-ITEM ORDER - GANGSTER MENSWEAR* 🔥\n\n`;
  message += `Hey ${FOUNDER_CONTACTS[recipient]?.name || 'Bro'}, I want to order these items from your store:\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.title}*\n   Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity} | ₹${item.price * item.quantity}\n`;
  });

  message += `\n💵 *Total Amount:* ₹${totalAmount}\n`;

  if (customer && customer.name) {
    message += `\n👤 *Customer:* ${customer.name}\n`;
    message += `📞 *Phone:* ${customer.phone}\n`;
    if (customer.address) {
      message += `📍 *Address:* ${customer.address.street}, ${customer.address.city}, ${customer.address.pincode}\n`;
    }
  }

  message += `\nPlease confirm my order! 📦`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

/**
 * Creates WhatsApp support message link
 */
export const createSupportWhatsAppLink = (recipient = 'shoeb', subject = 'General Inquiry') => {
  const number = FOUNDER_CONTACTS[recipient]?.whatsapp || FOUNDER_CONTACTS.shoeb.whatsapp;
  const message = `Hello ${FOUNDER_CONTACTS[recipient]?.name}, I have a question regarding *Gangster Menswear* (${subject}): `;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
