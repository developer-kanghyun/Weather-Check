import { useFavoriteEdit } from '../model/use-favorite-edit';

interface FavoriteEditFieldProps {
  favoriteId: string;
  currentName: string;
  onSuccess?: () => void;
  onEditingChange?: (isEditing: boolean) => void;
}

export function FavoriteEditField({ favoriteId, currentName, onSuccess, onEditingChange }: FavoriteEditFieldProps) {
  const {
    name,
    setName,
    cancel,
    save,
    handleKeyDown,
  } = useFavoriteEdit({ favoriteId, initialName: currentName, onComplete: onSuccess });

  const handleCancel = () => {
    cancel();
    onEditingChange?.(false);
  };

  const handleSave = () => {
    save();
    onEditingChange?.(false);
  };

  const handleKeyDownWithCallback = (e: React.KeyboardEvent) => {
    handleKeyDown(e);
    if (e.key === 'Enter' || e.key === 'Escape') {
      onEditingChange?.(false);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDownWithCallback}
        autoFocus
        className="flex-1 font-bold text-[#111618] bg-white/50 px-2 py-1 rounded border border-blue-500 outline-none min-w-0 text-sm"
      />
      <div className="flex items-center gap-1 flex-shrink-0">
        <button 
          onClick={handleSave}
          className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
          title="저장"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
        <button 
          onClick={handleCancel}
          className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          title="취소"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
