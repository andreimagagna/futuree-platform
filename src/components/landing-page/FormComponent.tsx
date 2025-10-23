import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/types/LandingPage';
import { useToast } from '@/hooks/use-toast';

interface FormComponentProps {
  props: {
    title?: string;
    subtitle?: string;
    fields: FormField[];
    submitText: string;
    privacyText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function FormComponent({ props, styles, isEditing, onEdit }: FormComponentProps) {
  const { title, subtitle, fields, submitText, privacyText, successMessage, redirectUrl } = props;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      onEdit?.();
      return;
    }

    // Validação
    const errors: string[] = [];
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors.push(`${field.label} é obrigatório`);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Erro no formulário",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simular envio (aqui você integraria com webhook/API)
    submitTimeoutRef.current = setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setIsSubmitting(false);
      submitTimeoutRef.current = null;

      toast({
        title: "Sucesso!",
        description: successMessage || "Formulário enviado com sucesso!",
      });

      if (redirectUrl) {
        redirectTimeoutRef.current = setTimeout(() => {
          window.location.href = redirectUrl;
          redirectTimeoutRef.current = null;
        }, 2000);
      }
    }, 1500);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Selecione...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => setFormData({ ...formData, [field.id]: checked })}
            />
            <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted && !isEditing) {
    return (
      <section style={styles} className="flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Tudo Certo!</h3>
            <p className="text-muted-foreground">
              {successMessage || 'Recebemos suas informações e entraremos em contato em breve.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className="relative"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground mb-8 text-center">
              {subtitle}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-lg">
            {fields.map(renderField)}

            {privacyText && (
              <p className="text-xs text-muted-foreground text-center">
                {privacyText}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : submitText}
            </Button>
          </form>
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Form
          </span>
        </div>
      )}
    </section>
  );
}
