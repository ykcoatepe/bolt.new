import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { apiKeysStore } from '~/lib/stores/apiKeys';

interface ApiKeysDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ApiKeysDialog({ open, onClose }: ApiKeysDialogProps) {
  const keys = useStore(apiKeysStore);
  const [openai, setOpenai] = useState(keys.openai || '');
  const [google, setGoogle] = useState(keys.google || '');
  const [anthropic, setAnthropic] = useState(keys.anthropic || '');

  const save = () => {
    apiKeysStore.set({ openai, google, anthropic });
    onClose();
  };

  return (
    <DialogRoot open={open}>
      <Dialog onBackdrop={onClose} onClose={onClose}>
        <DialogTitle>API Keys</DialogTitle>
        <DialogDescription asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="space-y-3"
          >
            <label className="flex flex-col">
              <span className="mb-1">OpenAI</span>
              <input
                value={openai}
                onChange={(e) => setOpenai(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Google</span>
              <input
                value={google}
                onChange={(e) => setGoogle(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Anthropic</span>
              <input
                value={anthropic}
                onChange={(e) => setAnthropic(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <DialogButton type="secondary" onClick={onClose}>Cancel</DialogButton>
              <DialogButton type="primary" onClick={save}>Save</DialogButton>
            </div>
          </form>
        </DialogDescription>
      </Dialog>
    </DialogRoot>
  );
}
