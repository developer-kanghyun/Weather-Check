import { useEffect, type RefObject } from 'react';

// 특정 요소의 바깥쪽을 클릭했을 때 콜백을 실행하는 커스텀 훅
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // 마우스 클릭 및 터치 이벤트 모두 대응 (모바일 지원)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback, enabled]);
};
