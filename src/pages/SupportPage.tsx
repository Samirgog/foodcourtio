import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNotifications } from '../stores';

const SupportContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ContactSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SectionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const SectionTitle = styled.div`
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const ContactInfo = styled.div`
  flex: 1;
  
  .title {
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .value {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  background: none;
  min-width: 80px;
  
  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${theme.colors.primaryHover};
          border-color: ${theme.colors.primaryHover};
        }
      `;
    } else {
      return `
        border-color: ${theme.colors.border};
        color: ${theme.colors.text};
        
        &:hover {
          background: ${theme.colors.surfaceHover};
          border-color: ${theme.colors.primary};
        }
      `;
    }
  }}
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialButton = styled(motion.a)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 32px;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    text-align: center;
  }
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.fast};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FAQSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const FAQItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

const FAQQuestion = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FAQAnswer = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const SupportPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    addNotification({
      type: 'success',
      title: 'Message Sent',
      message: 'Your support request has been submitted successfully. We\'ll get back to you soon!'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      value: '+1 (555) 123-4567',
      action: () => handleCall('+15551234567')
    },
    {
      icon: '📱',
      title: 'Mobile/SMS',
      value: '+1 (555) 987-6543',
      action: () => handleCall('+15559876543')
    },
    {
      icon: '📧',
      title: 'Email Support',
      value: 'support@foodcourt.io',
      action: () => handleEmail('support@foodcourt.io')
    },
    {
      icon: '💼',
      title: 'Business Email',
      value: 'business@foodcourt.io',
      action: () => handleEmail('business@foodcourt.io')
    }
  ];

  const socialPlatforms = [
    {
      name: 'Telegram',
      icon: '✈️',
      url: 'https://t.me/foodcourtio_support',
      color: '#0088cc'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: 'https://wa.me/15551234567',
      color: '#25d366'
    },
    {
      name: 'VKontakte',
      icon: '🌐',
      url: 'https://vk.com/foodcourtio',
      color: '#4c75a3'
    },
    {
      name: 'Discord',
      icon: '🎮',
      url: 'https://discord.gg/foodcourtio',
      color: '#5865f2'
    }
  ];

  const faqItems = [
    {
      question: 'How can I reset my restaurant password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page, or contact our support team for assistance.'
    },
    {
      question: 'How do I add employees to receive order notifications?',
      answer: 'Go to the Employees page, click "Generate Invite Link", and share the link with your employees. They\'ll join automatically via Telegram.'
    },
    {
      question: 'Can I customize my restaurant\'s appearance?',
      answer: 'Yes! Visit the Themes page to customize colors, layouts, and styling options for your restaurant\'s online presence.'
    },
    {
      question: 'How do I publish my restaurant menu?',
      answer: 'Complete your restaurant setup, add menu categories and products, then click the "Publish" button in the top toolbar.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support various payment providers including Stripe, PayPal, and local payment gateways. Configure them in Restaurant Settings.'
    }
  ];

  return (
    <SupportContainer>
      <Header>
        <h1>🎆 Support & Help</h1>
        <p>
          Get help, contact our support team, and find answers to your questions. 
          We're here to help you succeed with your restaurant.
        </p>
      </Header>

      <SupportGrid>
        {/* Contact Information */}
        <ContactSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SectionHeader>
            <SectionIcon>📞</SectionIcon>
            <SectionTitle>
              <h3>Contact Information</h3>
              <p>Get in touch with our support team</p>
            </SectionTitle>
          </SectionHeader>
          
          {contactMethods.map((method, index) => (
            <ContactItem key={index}>
              <ContactIcon>{method.icon}</ContactIcon>
              <ContactInfo>
                <div className="title">{method.title}</div>
                <div className="value">{method.value}</div>
              </ContactInfo>
              <ActionButton variant="primary" onClick={method.action}>
                Contact
              </ActionButton>
            </ContactItem>
          ))}
        </ContactSection>

        {/* Contact Form */}
        <ContactSection
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SectionHeader>
            <SectionIcon>💬</SectionIcon>
            <SectionTitle>
              <h3>Send us a Message</h3>
              <p>Fill out the form and we'll get back to you</p>
            </SectionTitle>
          </SectionHeader>
          
          <MessageForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Your Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your issue or question..."
                required
              />
            </FormGroup>
            
            <ActionButton type="submit" variant="primary">
              Send Message
            </ActionButton>
          </MessageForm>
        </ContactSection>
      </SupportGrid>

      {/* Social Media Links */}
      <ContactSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SectionHeader>
          <SectionIcon>🌐</SectionIcon>
          <SectionTitle>
            <h3>Connect with us on Social Media</h3>
            <p>Follow us for updates and quick support</p>
          </SectionTitle>
        </SectionHeader>
        
        <SocialGrid>
          {socialPlatforms.map((platform, index) => (
            <SocialButton
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="icon">{platform.icon}</div>
              <div className="label">{platform.name}</div>
            </SocialButton>
          ))}
        </SocialGrid>
      </ContactSection>

      {/* FAQ Section */}
      <FAQSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <SectionHeader>
          <SectionIcon>❓</SectionIcon>
          <SectionTitle>
            <h3>Frequently Asked Questions</h3>
            <p>Quick answers to common questions</p>
          </SectionTitle>
        </SectionHeader>
        
        {faqItems.map((item, index) => (
          <FAQItem key={index}>
            <FAQQuestion>{item.question}</FAQQuestion>
            <FAQAnswer>{item.answer}</FAQAnswer>
          </FAQItem>
        ))}
      </FAQSection>
    </SupportContainer>
  );
};

export default SupportPage;