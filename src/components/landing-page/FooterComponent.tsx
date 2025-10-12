import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  url: string;
}

interface FooterComponentProps {
  props: {
    logo?: string;
    logoText?: string;
    description?: string;
    columns?: FooterColumn[];
    socialLinks?: SocialLink[];
    contactInfo?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    copyrightText?: string;
    showNewsletter?: boolean;
    newsletterTitle?: string;
    newsletterPlaceholder?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function FooterComponent({ props, styles, isEditing, onEdit }: FooterComponentProps) {
  const {
    logo,
    logoText = 'Logo',
    description = 'Construindo o futuro com inovação e excelência.',
    columns = [],
    socialLinks = [],
    contactInfo = {},
    copyrightText = '© 2025 Todos os direitos reservados.',
    showNewsletter = true,
    newsletterTitle = 'Fique por dentro',
    newsletterPlaceholder = 'Seu email',
  } = props;

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: 'w-5 h-5' };
    switch (platform) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <footer
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              {logo && <img src={logo} alt={logoText} className="h-8 w-auto" />}
              <span className="text-xl font-bold">{logoText}</span>
            </div>
            <p className="text-muted-foreground mb-4">{description}</p>
            
            {/* Contact Info */}
            {(contactInfo.email || contactInfo.phone || contactInfo.address) && (
              <div className="space-y-2 text-sm">
                {contactInfo.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                {contactInfo.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {columns.map((column, index) => (
            <div key={index} className="lg:col-span-2">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {showNewsletter && (
            <div className="lg:col-span-4">
              <h3 className="font-semibold mb-4">{newsletterTitle}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Receba novidades e atualizações diretamente no seu email.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold whitespace-nowrap"
                >
                  Inscrever
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{copyrightText}</p>
          
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Footer
          </span>
        </div>
      )}
    </footer>
  );
}
