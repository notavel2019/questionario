'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/client';

export function AuthButton() {
  const { user, isConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isConfigured) return null;

  if (user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-white hover:bg-white/10 hover:text-white"
        onClick={() => auth && signOut(auth)}
      >
        <LogOut className="h-4 w-4" />
        Sair ({user.email})
      </Button>
    );
  }

  async function handleSubmit() {
    if (!auth) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <LogIn className="h-4 w-4" />
        Entrar
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </DialogTitle>
            <DialogDescription>
              Faça login pra manter seu histórico de conversões e assinar o plano ilimitado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleSubmit} disabled={loading || !email || !password} className="w-full">
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="w-full"
            >
              {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
