import React from 'react';
import { X, BookOpen, Volume2, Globe, Sparkles } from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[#d4af37]/45 bg-gradient-to-b from-[#172620] to-[#0c1411] p-5 shadow-2xl max-h-[86dvh] overflow-y-auto custom-scroll">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно информации"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[#cbbd9e] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[#e8c667] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>О проекте «Фаворит истории»</span>
        </div>
        <h3 className="mt-1 font-imperial text-2xl font-bold text-[#fff5dc]">
          Архивный голос и машина времени
        </h3>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#d7e0da]">
          <div className="p-3 rounded-xl bg-[#0b1310]/80 border border-[#d4af37]/20">
            <div className="flex items-center gap-1.5 font-semibold text-[#f1d687] mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Предзаписанный нейросетевой голос с немецким акцентом</span>
            </div>
            <p>
              Все 66 реплик Екатерины II заранее синтезированы нейросетью в двух регистрах
              (<strong>«Официальный»</strong> и <strong>«Как с Вольтером»</strong>) с лёгким аристократическим
              немецким акцентом — в духе принцессы Софии Ангальт-Цербстской. Файлы лежат в папке
              <code className="text-[#f1d687]">audio/</code> и загружаются вместе с игрой.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0b1310]/80 border border-[#d4af37]/20">
            <div className="flex items-center gap-1.5 font-semibold text-[#f1d687] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Историческая основа реплик</span>
            </div>
            <p>
              Тексты опираются на реальные документы XVIII века: «Записки императрицы Екатерины II»,
              «Наказ» 1767 года, Жалованную грамоту дворянству 1785 года, тайную переписку с Г. А. Потёмкиным
              и многолетнюю переписку с Вольтером.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0b1310]/80 border border-[#d4af37]/20">
            <div className="flex items-center gap-1.5 font-semibold text-[#f1d687] mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Запуск с GitHub Pages без сервера</span>
            </div>
            <p>
              Сборка <code className="text-[#f1d687]">dist/</code> содержит <code className="text-[#f1d687]">index.html</code>{' '}
              и папку <code className="text-[#f1d687]">audio/</code> с 66 MP3-репликами. Публикация на GitHub
              Pages выполняется автоматически через GitHub Actions при каждом пуше в основную ветку.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b7861c] to-[#dfc065] text-[#11140d] font-semibold text-xs cursor-pointer hover:brightness-105"
        >
          Вернуться в Зимний дворец
        </button>
      </div>
    </div>
  );
};
