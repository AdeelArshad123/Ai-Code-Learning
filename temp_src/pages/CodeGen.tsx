import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Bookmark, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { codeGenService, CodeGeneration } from '../services/codeGenService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
];

export function CodeGen() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CodeGeneration[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const data = await codeGenService.getUserGenerations(user.id);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const { code, explanation } = await codeGenService.generateCode(prompt, selectedLanguage);
      setGeneratedCode(code);
      setExplanation(explanation);

      if (user) {
        await codeGenService.saveGeneration({
          user_id: user.id,
          prompt,
          language: selectedLanguage,
          generated_code: code,
          explanation,
          is_bookmarked: false,
        });
        loadHistory();
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleBookmark = async (id: string, currentState: boolean) => {
    try {
      await codeGenService.toggleBookmark(id, !currentState);
      loadHistory();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const deleteGeneration = async (id: string) => {
    try {
      await codeGenService.deleteGeneration(id);
      loadHistory();
    } catch (error) {
      console.error('Error deleting generation:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Code2 className="h-10 w-10" />
          AI Code Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Generate code examples in multiple languages with explanations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Programming Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedLanguage === lang
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Describe what you want to create
                </label>
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a function that sorts an array of numbers"
                  className="mb-2"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Generate Code'}
              </Button>
            </CardContent>
          </Card>

          {generatedCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Code</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode}</code>
                  </pre>

                  {explanation && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-sm text-muted-foreground">{explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>History</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide' : 'Show'}
                </Button>
              </div>
            </CardHeader>
            {showHistory && (
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No code generations yet
                  </p>
                ) : (
                  history.map((gen) => (
                    <motion.div
                      key={gen.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-primary mb-1">
                            {gen.language}
                          </div>
                          <p className="text-sm line-clamp-2">{gen.prompt}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleBookmark(gen.id!, gen.is_bookmarked)}
                            className="p-1 hover:bg-accent rounded"
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                gen.is_bookmarked ? 'fill-primary text-primary' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => deleteGeneration(gen.id!)}
                            className="p-1 hover:bg-accent rounded text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setGeneratedCode(gen.generated_code);
                          setExplanation(gen.explanation);
                          setPrompt(gen.prompt);
                          setSelectedLanguage(gen.language);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        View code
                      </button>
                    </motion.div>
                  ))
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
