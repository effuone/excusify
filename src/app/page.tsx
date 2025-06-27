'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';

export default function Excusify() {
  const [reason, setReason] = useState('');
  const [excuse, setExcuse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateExcuse = async () => {
    if (!reason.trim()) {
      setError('Пожалуйста, сначала введите причину!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-excuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось сгенерировать оправдание');
      }

      setExcuse(data.excuse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так!');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(excuse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sampleReasons = [
    'Я спал',
    'Я был занят работой',
    'У меня разрядился телефон',
    'Я ел',
    'Я забыл ответить',
    'Я был на встрече',
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-600 p-2 rounded-lg'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Excusify
              </h1>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Превратите простые причины в креативные оправдания
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Input Section */}
          <div className='cf-card'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Какая у вас простая причина?
            </h2>

            <div className='space-y-4'>
              <div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder='например: я спал, я был занят, у меня разрядился телефон...'
                  className='cf-input w-full min-h-[120px] resize-none'
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className='flex items-center gap-2 text-red-600 dark:text-red-400 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  {error}
                </div>
              )}

              <button
                onClick={generateExcuse}
                disabled={isLoading || !reason.trim()}
                className='cf-button w-full flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <RefreshCw className='w-4 h-4 animate-spin' />
                    <span className='loading-dots'>
                      Создаём ваше оправдание
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4' />
                    Создать оправдание
                  </>
                )}
              </button>
            </div>

            {/* Sample Reasons */}
            <div className='mt-6'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                Быстрые примеры:
              </h3>
              <div className='flex flex-wrap gap-2'>
                {sampleReasons.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setReason(sample)}
                    className='px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full transition-colors'
                    disabled={isLoading}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className='cf-card'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Ваше креативное оправдание
              </h2>
              {excuse && (
                <button
                  onClick={copyToClipboard}
                  className='flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors'
                >
                  {copied ? (
                    <>
                      <Check className='w-4 h-4' />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className='w-4 h-4' />
                      Копировать
                    </>
                  )}
                </button>
              )}
            </div>

            <div className='min-h-[200px] bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600'>
              {excuse ? (
                <p className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                  {excuse}
                </p>
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500 dark:text-gray-400'>
                  <div className='text-center'>
                    <Sparkles className='w-12 h-12 mx-auto mb-4 opacity-50' />
                    <p>Ваше креативное оправдание появится здесь!</p>
                    <p className='text-sm mt-2'>
                      Введите причину и нажмите кнопку создания для начала.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fun Stats/Features */}
        <div className='mt-12 cf-card'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Почему Excusify?
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Sparkles className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                Искусственный интеллект
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Использует продвинутый ИИ для превращения простых причин в
                подробные, забавные оправдания.
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <RefreshCw className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                Всегда креативно
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Получайте уникальные, юмористические оправдания каждый раз.
                Креативные ответы никогда не закончатся!
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Copy className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                Легко поделиться
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Копирование в один клик позволяет легко делиться вашим идеальным
                оправданием где угодно.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-12'>
        <div className='max-w-4xl mx-auto px-4 py-6 text-center'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            Сделано с ❤️ для тех, кому нужны креативные оправдания. Используйте
            ответственно! 😉
          </p>
        </div>
      </footer>
    </div>
  );
}
