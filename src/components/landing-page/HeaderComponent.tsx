import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface MenuItem {
  label: string;
  link: string;
  submenu?: MenuItem[];
}

interface HeaderComponentProps {
  props: {
    logo?: string;
    logoText?: string;
    menuItems?: MenuItem[];
    ctaText?: string;
    ctaLink?: string;
    sticky?: boolean;
    transparent?: boolean;
    alignment?: 'left' | 'center' | 'space-between';
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function HeaderComponent({ props, styles, isEditing, onEdit }: HeaderComponentProps) {
  const {
    logo,
    logoText = 'Logo',
    menuItems = [],
    ctaText = 'Começar',
    ctaLink = '#',
    sticky = true,
    transparent = false,
    alignment = 'space-between',
  } = props;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  return (
    <header
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`${sticky ? 'sticky top-0 z-50' : 'relative'} ${
        transparent ? 'bg-transparent' : 'bg-background border-b'
      } ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <nav
          className={`flex items-center py-4 ${
            alignment === 'center' ? 'justify-center' : `justify-${alignment}`
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            {logo && <img src={logo} alt={logoText} className="h-8 w-auto" />}
            <span className="text-xl font-bold">{logoText}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 mx-8">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.link}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  {item.label}
                  {item.submenu && item.submenu.length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </a>
                {item.submenu && item.submenu.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.submenu.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.link}
                        className="block px-4 py-2 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          {ctaText && (
            <a
              href={ctaLink}
              className="hidden md:inline-flex px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {ctaText}
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-auto p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {menuItems.map((item, index) => (
              <div key={index} className="py-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setActiveSubmenu(activeSubmenu === index ? null : index)
                  }
                >
                  <a href={item.link} className="flex-1">
                    {item.label}
                  </a>
                  {item.submenu && item.submenu.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeSubmenu === index ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                {item.submenu &&
                  item.submenu.length > 0 &&
                  activeSubmenu === index && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.link}
                          className="block py-1 text-muted-foreground hover:text-foreground"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            {ctaText && (
              <a
                href={ctaLink}
                className="block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-center font-semibold"
              >
                {ctaText}
              </a>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Header
          </span>
        </div>
      )}
    </header>
  );
}
