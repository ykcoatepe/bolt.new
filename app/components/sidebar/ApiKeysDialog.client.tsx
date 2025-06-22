import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { useApiKeysStore } from '~/lib/stores/apiKeys';

interface ApiKeysDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ApiKeysDialog({ open, onClose }: ApiKeysDialogProps) {
  const apiKeys = useApiKeysStore();
  const [openai, setOpenai] = useState('');
  const [google, setGoogle] = useState('');
  const [anthropic, setAnthropic] = useState('');

  useEffect(() => {
    if (open) {
      apiKeys.load();
      setOpenai(apiKeys.getKey('openai') || '');
      setGoogle(apiKeys.getKey('google') || '');
      setAnthropic(apiKeys.getKey('anthropic') || '');
    }
  }, [open]);

  const save = () => {
    if (!openai.trim() || !google.trim() || !anthropic.trim()) {
      toast.error('All keys are required');
      return;
    }

    apiKeys.setKey('openai', openai.trim());
    apiKeys.setKey('google', google.trim());
    apiKeys.setKey('anthropic', anthropic.trim());
    apiKeys.persist();
    toast.success('Saved!');
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
                type="password"
                value={openai}
                onChange={(e) => setOpenai(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Google</span>
              <input
                type="password"
                value={google}
                onChange={(e) => setGoogle(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1">Anthropic</span>
              <input
                type="password"
                value={anthropic}
                onChange={(e) => setAnthropic(e.target.value)}
                className="border rounded px-2 py-1 bg-bolt-elements-background-depth-1"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <DialogButton type="secondary" onClick={onClose}>
                Cancel
              </DialogButton>
              <DialogButton type="primary" onClick={save}>
                Save
              </DialogButton>
            </div>
          </form>
        </DialogDescription>
      </Dialog>
    </DialogRoot>
  );
}
