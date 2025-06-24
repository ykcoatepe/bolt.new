import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { apiConfigStore, setAPIConfig, type Provider } from '~/lib/stores/apiConfig';

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
}

const providers: Provider[] = ['anthropic', 'openai', 'google'];

export function ApiKeyDialog({ open, onOpenChange }: Props) {
  const current = useStore(apiConfigStore);
  const [provider, setProvider] = useState<Provider>(current?.provider ?? 'openai');
  const [apiKey, setApiKey] = useState(current?.apiKey ?? '');
  const [testResult, setTestResult] = useState<string>();

  const testKey = async () => {
    const res = await fetch('/api/test-key', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider, apiKey }),
    });
    const data = await res.json();

    if (data.success) {
      setTestResult('Success');
    } else {
      setTestResult('Failed');
      toast.error('API key test failed');
    }
  };

  const save = () => {
    setAPIConfig({ provider, apiKey });
    onOpenChange(false);
  };

  return (
    <DialogRoot open={open}>
      <Dialog onBackdrop={() => onOpenChange(false)} onClose={() => onOpenChange(false)}>
        <DialogTitle>API Configuration</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-2">
            <label className="flex gap-2 items-center">
              Provider
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                className="flex-1 border p-1 rounded"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex gap-2 items-center">
              API Key
              <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="flex-1 border p-1 rounded" />
            </label>
            {testResult && <p>Test result: {testResult}</p>}
          </div>
        </DialogDescription>
        <div className="px-5 pb-4 bg-bolt-elements-background-depth-2 flex gap-2 justify-end">
          <DialogButton type="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </DialogButton>
          <DialogButton type="primary" onClick={testKey}>
            Test
          </DialogButton>
          <DialogButton type="primary" onClick={save}>
            Save
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
