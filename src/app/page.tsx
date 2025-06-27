'use client';

import { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Shuffle,
} from 'lucide-react';

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
    '🃏 Я играл в покер всю ночь',
    '💰 Считал деньги в банке',
    '🎰 Был в казино и забыл про телефон',
    '♠️ Изучал карточные комбинации',
    '🤑 Торговал на бирже',
    '🎲 Играл в настольные игры',
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-green-900 dark:to-emerald-800'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg'>
              <span className='text-2xl'>🃏</span>
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                💰 Excusify Casino 🎰
              </h1>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                🎲 Превратите простые причины в королевские блефы! 🤑
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
              🎯 Какая у вас простая причина? 🃏
            </h2>

            <div className='space-y-4'>
              <div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder='🎲 например: играл в покер, считал деньги, был в казино... 💰'
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
                    <span className='loading-dots'>🎲 Тасуем карты блефа</span>
                  </>
                ) : (
                  <>
                    <Shuffle className='w-4 h-4' />
                    🎰 Сдать карты блефа! 🃏
                  </>
                )}
              </button>
            </div>

            {/* Sample Reasons */}
            <div className='mt-6'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                🎯 Быстрые ставки:
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
                🤴 Ваш королевский блеф 🎭
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
                    <p>🎰 Ваш королевский блеф появится здесь! 🤴</p>
                    <p className='text-sm mt-2'>
                      🎲 Поставьте причину и сдайте карты блефа! 💸
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
            🎰 Почему Excusify Casino? 💰
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-xl'>🤖</span>
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                🎯 ИИ-Дилер
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                🎲 Умный дилер раздаёт самые убедительные карты блефа!
                Превращает простые причины в королевские комбинации. 💰
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-xl'>🎰</span>
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                🎲 Бесконечный Джекпот
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                🃏 Каждый спин даёт уникальную комбинацию блефа! Джекпот
                креативности никогда не заканчивается! 💸
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-xl'>💎</span>
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                💸 Мгновенная Выплата
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                🎯 Один клик - и ваш блеф готов к игре! Делитесь королевскими
                комбинациями везде! 🤑
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-12'>
        <div className='max-w-4xl mx-auto px-4 py-6 text-center'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            🎰 Создано с ❤️ для мастеров блефа! Играйте ответственно! 🃏💰🎲
            Удачи в игре! 🤑
          </p>
        </div>
      </footer>
    </div>
  );
}
