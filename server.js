require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Environment variable validation
const requiredEnvVars = ['SENDGRID_API_KEY', 'EMAIL_USER', 'OPENROUTER_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('Environment variables validated successfully.');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✓ Set' : '✗ Missing');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✓ Set' : '✗ Missing');
console.log('OPENROUTER_BASE_URL:', process.env.OPENROUTER_BASE_URL || 'Using default');
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'Using default');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const msg = {
      to: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER, // Must be verified in SendGrid
      replyTo: email,
      subject: `Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully:', result[0]?.headers?.['x-message-id']);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Chat endpoint using OpenRouter API
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://home-accessories.com', // Optional, for rankings
        'X-Title': 'Home Accessories AI Assistant' // Optional
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that ONLY answers questions about the products and services available on this home accessories website. The website sells door hardware including locks, handles, hinges, door closers, and security solutions. You must NOT answer any questions outside of this scope - including general knowledge, advice about other products, or any topics not related to what this website offers. If asked about anything outside the website\'s products and services, politely say you can only help with questions about the door hardware and security products available on this site. Be helpful and knowledgeable only about the specific products listed on the website.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return res.status(response.status).json({ error: 'Failed to get AI response' });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
