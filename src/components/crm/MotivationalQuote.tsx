/**
 * ============================================================================
 * FREQUÊNCIA MOTIVACIONAL
 * ============================================================================
 * Componente que exibe frases motivacionais de filósofos, pensadores e Bíblia
 * para elevar a motivação dos vendedores
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quote {
  text: string;
  author: string;
  category: 'filosofo' | 'biblia' | 'pensador' | 'empresario';
}

const quotes: Quote[] = [
  // Filósofos
  { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin", category: "filosofo" },
  { text: "Conhece-te a ti mesmo.", author: "Sócrates", category: "filosofo" },
  { text: "A vida não examinada não vale a pena ser vivida.", author: "Sócrates", category: "filosofo" },
  { text: "O sábio não diz tudo o que pensa, mas pensa em tudo o que diz.", author: "Aristóteles", category: "filosofo" },
  { text: "A excelência não é um ato, mas um hábito.", author: "Aristóteles", category: "filosofo" },
  { text: "Você se torna aquilo que você acredita.", author: "Oprah Winfrey", category: "pensador" },
  
  // Bíblia
  { text: "Tudo posso naquele que me fortalece.", author: "Filipenses 4:13", category: "biblia" },
  { text: "O Senhor é meu pastor, nada me faltará.", author: "Salmos 23:1", category: "biblia" },
  { text: "Confie no Senhor de todo o seu coração.", author: "Provérbios 3:5", category: "biblia" },
  { text: "Seja forte e corajoso. Não tenha medo.", author: "Josué 1:9", category: "biblia" },
  { text: "Com Deus, tudo é possível.", author: "Mateus 19:26", category: "biblia" },
  { text: "A fé sem obras é morta.", author: "Tiago 2:26", category: "biblia" },
  
  // Pensadores & Empresários
  { text: "A única maneira de fazer um ótimo trabalho é amar o que você faz.", author: "Steve Jobs", category: "empresario" },
  { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier", category: "pensador" },
  { text: "Não espere por oportunidades. Crie-as.", author: "George Bernard Shaw", category: "pensador" },
  { text: "O fracasso é apenas a oportunidade de começar de novo de forma mais inteligente.", author: "Henry Ford", category: "empresario" },
  { text: "Acredite que você pode e você já está no meio do caminho.", author: "Theodore Roosevelt", category: "pensador" },
  { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn", category: "empresario" },
  { text: "Você perde 100% das chances que não aproveita.", author: "Wayne Gretzky", category: "pensador" },
  { text: "O maior risco é não correr risco algum.", author: "Mark Zuckerberg", category: "empresario" },
  { text: "Sucesso é ir de fracasso em fracasso sem perder o entusiasmo.", author: "Winston Churchill", category: "pensador" },
  { text: "Seja a mudança que você deseja ver no mundo.", author: "Mahatma Gandhi", category: "pensador" },
  { text: "O único limite para as nossas realizações de amanhã são as nossas dúvidas de hoje.", author: "Franklin D. Roosevelt", category: "pensador" },
  { text: "Não conte os dias, faça os dias contarem.", author: "Muhammad Ali", category: "pensador" },
  { text: "A melhor hora para plantar uma árvore foi há 20 anos. A segunda melhor hora é agora.", author: "Provérbio Chinês", category: "pensador" },
  { text: "Eu não falhei 10.000 vezes. Encontrei 10.000 maneiras que não funcionam.", author: "Thomas Edison", category: "empresario" },
  { text: "Seus clientes mais insatisfeitos são sua maior fonte de aprendizado.", author: "Bill Gates", category: "empresario" },
  { text: "Se você não está disposto a arriscar, esteja disposto a uma vida comum.", author: "Jim Rohn", category: "empresario" },
  { text: "O sucesso geralmente vem para aqueles que estão ocupados demais para procurá-lo.", author: "Henry David Thoreau", category: "pensador" },
  { text: "Não se preocupe com os fracassos, preocupe-se com as chances que você perde quando nem tenta.", author: "Jack Canfield", category: "empresario" },
  { text: "Oportunidades não acontecem. Você as cria.", author: "Chris Grosser", category: "empresario" },
  { text: "O empreendedor sempre procura mudança, reage a ela e a explora como uma oportunidade.", author: "Peter Drucker", category: "empresario" },
  { text: "Sua maior vantagem competitiva é sua capacidade de aprender mais rápido que seus concorrentes.", author: "Brian Tracy", category: "empresario" },
  { text: "Não tenha medo de desistir do bom para ir atrás do ótimo.", author: "John D. Rockefeller", category: "empresario" },
  { text: "A inovação distingue um líder de um seguidor.", author: "Steve Jobs", category: "empresario" },
  { text: "Faça o que você ama e o dinheiro virá.", author: "Marsha Sinetar", category: "empresario" },
  { text: "A melhor maneira de prever o futuro é criá-lo.", author: "Peter Drucker", category: "empresario" },
  { text: "Não é o mais forte que sobrevive, mas o mais adaptável.", author: "Charles Darwin", category: "pensador" },
  { text: "Se você realmente quer fazer algo, encontrará um caminho. Se não, encontrará uma desculpa.", author: "Jim Rohn", category: "empresario" },
  { text: "O único lugar onde sucesso vem antes de trabalho é no dicionário.", author: "Vidal Sassoon", category: "empresario" },
  { text: "Não conte para as pessoas seus planos. Mostre-lhes seus resultados.", author: "Unknown", category: "empresario" },
  { text: "A persistência supera até o talento.", author: "Unknown", category: "empresario" },
  { text: "Grandes coisas nunca vêm de zonas de conforto.", author: "Unknown", category: "empresario" },
  { text: "A motivação te leva longe. O hábito te mantém lá.", author: "Jim Ryun", category: "empresario" },
  { text: "Sonhe grande. Comece pequeno. Mas acima de tudo, comece.", author: "Simon Sinek", category: "empresario" },
  { text: "A qualidade não é um ato, é um hábito.", author: "Aristóteles", category: "filosofo" },
  { text: "O segredo do sucesso é começar.", author: "Mark Twain", category: "pensador" },
];

const categoryColors = {
  filosofo: 'bg-primary/10 border-primary/20 text-primary',
  biblia: 'bg-accent/10 border-accent/20 text-accent',
  pensador: 'bg-success/10 border-success/20 text-success',
  empresario: 'bg-warning/10 border-warning/20 text-warning',
};

const categoryLabels = {
  filosofo: 'Filósofo',
  biblia: 'Bíblia',
  pensador: 'Pensador',
  empresario: 'Empresário',
};

interface MotivationalQuoteProps {
  onClose: () => void;
}

export function MotivationalQuote({ onClose }: MotivationalQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const handleNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  return (
    <Card className="w-[420px] shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border-2 border-primary/20 shadow-sm">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-primary">
              Frequência Motivacional
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Inspiração para seu dia
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        <div
          className={cn(
            "space-y-4 transition-all duration-300",
            isAnimating && "opacity-0 scale-95"
          )}
        >
          {/* Quote */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 text-6xl text-primary/20 font-serif">"</div>
            <p className="text-lg leading-relaxed font-medium text-foreground pl-8 pr-4 italic">
              {currentQuote.text}
            </p>
            <div className="absolute -bottom-4 -right-2 text-6xl text-primary/20 font-serif rotate-180">"</div>
          </div>

          {/* Author & Category */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <div>
              <p className="text-sm font-bold text-foreground">
                — {currentQuote.author}
              </p>
              <span
                className={cn(
                  "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border",
                  categoryColors[currentQuote.category]
                )}
              >
                {categoryLabels[currentQuote.category]}
              </span>
            </div>

            <Button
              onClick={handleNewQuote}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            >
              <RefreshCw className={cn("h-4 w-4", isAnimating && "animate-spin")} />
              Nova Frase
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-center text-muted-foreground">
            💪 Mantenha-se motivado e conquiste suas metas! 🎯
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
