import { createContext, useContext, type ReactNode } from 'react';
import { useDialog } from '@/hooks';
import { useRouteHandle } from './useRouteHandle';
import AllMenuDialog from '@/layout/Header/AllMenuDialog';

interface AllMenuContextValue {
  open: (trigger?: HTMLElement) => void;
}

const AllMenuContext = createContext<AllMenuContextValue | null>(null);

/** 전체메뉴 다이얼로그를 앱 루트에 한 번만 마운트하고, 어디서든 열 수 있게 하는 컨텍스트 */
export function AllMenuProvider({ children }: { children: ReactNode }) {
  const dialog = useDialog<HTMLDivElement>();
  const handle = useRouteHandle();

  return (
    <AllMenuContext.Provider value={{ open: dialog.open }}>
      {children}
      <AllMenuDialog
        dialogRef={dialog.ref}
        isOpen={dialog.isOpen}
        onClose={dialog.close}
        currentGnbId={handle?.gnbId}
        currentLnbId={handle?.lnbId}
      />
    </AllMenuContext.Provider>
  );
}

export function useAllMenu(): AllMenuContextValue {
  const ctx = useContext(AllMenuContext);
  if (!ctx) throw new Error('useAllMenu는 AllMenuProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
