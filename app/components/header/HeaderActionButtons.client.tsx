"use client";

import { useState } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { ApiKeyDialog } from './ApiKeyDialog.client';

export default function HeaderActionButtons() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button
        data-testid="api-keys-btn"
        className="inline-flex items-center gap-1 text-sm font-medium"
        onClick={() => setOpen(true)}
      >
        <KeyIcon className="w-4 h-4" />
        <span className="hidden sm:inline">API Keys</span>
      </button>
      {open && <ApiKeyDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
