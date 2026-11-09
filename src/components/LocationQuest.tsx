import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  BookOpen,
  ScrollText,
  Feather,
  Award,
  Crown,
  User,
  ArrowRight,
  X,
} from 'lucide-react';
import { ARTIFACTS, LOCATIONS } from '../data/gameData';
import { Artifact } from '../types/game';

interface LocationQuestProps {
  foundIds: string[];
  onDiscoverArtifact: (artifact: Artifact) => void;
  onInspectArtifact: (artifact: Artifact) => void;
  onFinishQuest: () => void;
  onSwitchLocation: (locationId: 'study' | 'gallery') => void;
}

const ArtifactIcon: React.FC<{ name: Artifact['iconName']; className?: string }> = ({
  name,
  className = 'w-4 h-4',
}) => {
  switch (name) {
    case 'portrait':
      return <User className={className} />;
    case 'scroll':
      return <ScrollText className={className} />;
    case 'feather':
      return <Feather className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'medal':
      return <Award className={className} />;
    case 'crown':
      return <Crown className={className} />;
  }
};

export const LocationQuest: React.FC<LocationQuestProps> = ({
  foundIds,
  onDiscoverArtifact,
  onInspectArtifact,
  onFinishQuest,
  onSwitchLocation,
}) => {
  const [activeLocId, setActiveLocId] = useState<'study' | 'gallery'>('study');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [showRadarLabels, setShowRadarLabels] = useState(false);

  const currentLoc = LOCATIONS.find((l) => l.id === activeLocId)!;
  const locArtifacts = ARTIFACTS.filter((a) => a.locationId === activeLocId);
  const canProceed = foundIds.length >= 3;
  const allFound = foundIds.length === ARTIFACTS.length;

  const handleSelectRoom = (id: 'study' | 'gallery') => {
    setActiveLocId(id);
    setSelectedArtifact(null);
    onSwitchLocation(id);
  };

  const handleHotspotClick = (artifact: Artifact) => {
    const isAlreadyFound = foundIds.includes(artifact.id);
    setSelectedArtifact(artifact);
    if (!isAlreadyFound) {
      onDiscoverArtifact(artifact);
    } else {
      onInspectArtifact(artifact);
    }
  };

  const handleTriggerHint = () => {
    setShowRadarLabels(true);
    window.setTimeout(() => setShowRadarLabels(false), 4500);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2">
      {/* Compact Room Switcher + Candle Hint */}
      <div className="shrink-0 flex items-center gap-1.5">
        {LOCATIONS.map((loc) => {
          const roomCount = ARTIFACTS.filter((a) => a.locationId === loc.id).length;
          const roomFound = ARTIFACTS.filter(
            (a) => a.locationId === loc.id && foundIds.includes(a.id)
          ).length;
          const isActive = loc.id === activeLocId;

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelectRoom(loc.id)}
              className={`flex-1 flex items-center justify-between gap-1 px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-[#23382e] to-[#13201b] border-[#d4af37]/65 text-[#fff5dc]'
                  : 'bg-[#101a16]/85 border-[#d4af37]/20 text-[#b4c3ba] hover:border-[#d4af37]/40'
              }`}
            >
              <span className="font-imperial text-sm font-bold truncate">
                {loc.id === 'study' ? 'Кабинет' : 'Эрмитаж'}
              </span>
              <span
                className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${
                  roomFound === roomCount
                    ? 'bg-[#2a5c43]/70 text-[#9ff0c1]'
                    : 'bg-[#09110e] text-[#e8c667]'
                }`}
              >
                {roomFound}/{roomCount}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleTriggerHint}
          title="Подсветить предметы"
          className="shrink-0 flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/35 text-[#f2d682] text-xs font-medium transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">Свеча</span>
        </button>
      </div>

      {/* Flexible Interactive Palace Scene */}
      <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-[#0b1310] shadow-xl select-none">
        <img
          src={currentLoc.image}
          alt={currentLoc.name}
          className="w-full h-full object-cover brightness-[0.88] contrast-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09100d]/85 via-transparent to-[#09100d]/45 pointer-events-none" />

        {/* Top scene title pill */}
        <div className="absolute top-2 inset-x-2.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-[#09110e]/80 border border-[#d4af37]/30 backdrop-blur-sm text-[11px] font-semibold text-[#f3da8b] truncate">
            {currentLoc.name}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#09110e]/80 border border-[#d4af37]/25 backdrop-blur-sm text-[10px] text-[#d8cbb0] shrink-0">
            Найдено: {foundIds.length}/{ARTIFACTS.length}
          </span>
        </div>

        {/* Interactive Hotspots */}
        {locArtifacts.map((artifact) => {
          const isFound = foundIds.includes(artifact.id);
          const isSelected = selectedArtifact?.id === artifact.id;

          return (
            <button
              key={artifact.id}
              type="button"
              onClick={() => handleHotspotClick(artifact)}
              style={{ left: `${artifact.x}%`, top: `${artifact.y}%` }}
              aria-label={artifact.shortTag}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10"
            >
              <div
                className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-transform duration-200 group-hover:scale-110 ${
                  isFound
                    ? 'bg-[#1b4733]/90 border-[#7ce8ae] text-[#b4fbd4] shadow-[0_0_12px_rgba(124,232,174,0.45)]'
                    : 'bg-[#1a150b]/85 border-[#f0c85a] text-[#f9df8b] hotspot-pulse'
                } ${isSelected ? 'scale-115 ring-2 ring-white/80' : ''}`}
              >
                {isFound ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ArtifactIcon name={artifact.iconName} className="w-4 h-4" />
                )}
              </div>

              {(showRadarLabels || isSelected) && (
                <span
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-semibold border shadow-md ${
                    isFound
                      ? 'bg-[#10281d]/95 border-[#7ce8ae]/45 text-[#bbf7d6]'
                      : 'bg-[#18130a]/95 border-[#e8c667]/50 text-[#f8e39e]'
                  }`}
                >
                  {artifact.shortTag}
                </span>
              )}
            </button>
          );
        })}

        {/* Bottom Overlay inside Scene: Artifact Card OR Compact Room Checklist Chips */}
        <div className="absolute bottom-2 inset-x-2 z-20">
          {selectedArtifact ? (
            <div className="relative rounded-xl border border-[#e8c667]/55 bg-[#0b1511]/92 backdrop-blur-md p-2.5 shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedArtifact(null)}
                aria-label="Скрыть карточку"
                className="absolute top-2 right-2 p-1 rounded-md text-[#cbbd9e] hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-start gap-2 pr-6">
                <div className="p-1.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3d67d] shrink-0">
                  <ArtifactIcon name={selectedArtifact.iconName} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-[#e8c667] leading-none">
                    {selectedArtifact.year} • Подсказка открыта
                  </div>
                  <h4 className="font-imperial text-base font-bold text-[#fff6df] leading-tight truncate">
                    {selectedArtifact.title}
                  </h4>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[#a7f3c6]">
                <strong>К экзамену:</strong> {selectedArtifact.hintText}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 overflow-hidden">
              {locArtifacts.map((art) => {
                const found = foundIds.includes(art.id);
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleHotspotClick(art)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border text-[10.5px] font-medium backdrop-blur-md transition-all cursor-pointer ${
                      found
                        ? 'bg-[#163626]/90 border-[#6cd49c]/45 text-[#baf7d4]'
                        : 'bg-[#0b1310]/85 border-[#d4af37]/30 text-[#e4d5aa] hover:border-[#e8c667]/60'
                    }`}
                  >
                    {found ? (
                      <CheckCircle2 className="w-3 h-3 shrink-0 text-[#7ce8ae]" />
                    ) : (
                      <ArtifactIcon name={art.iconName} className="w-3 h-3 shrink-0 text-[#e8c667]" />
                    )}
                    <span className="truncate">{art.shortTag}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <button
        type="button"
        onClick={onFinishQuest}
        disabled={!canProceed}
        className={`shrink-0 w-full py-3 px-4 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all ${
          canProceed
            ? 'bg-gradient-to-r from-[#b7861c] via-[#e4c161] to-[#c49222] text-[#11140d] shadow-[0_6px_20px_rgba(212,175,55,0.35)] hover:brightness-105 active:scale-[0.99] cursor-pointer'
            : 'bg-[#15211c] text-[#83948a] border border-[#d4af37]/15 cursor-not-allowed'
        }`}
      >
        {canProceed ? (
          <>
            <span>
              {allFound
                ? 'Все 6 реликвий собраны! К экзамену'
                : `Предстать пред Императрицей (${foundIds.length}/6)`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <span>Найдите минимум 3 реликвии ({foundIds.length}/3) для допуска</span>
        )}
      </button>
    </div>
  );
};
