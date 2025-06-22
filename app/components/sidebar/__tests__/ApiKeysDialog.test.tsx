import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiKeysDialog } from '~/components/sidebar/ApiKeysDialog.client';
import { useApiKeysStore } from '~/lib/stores/apiKeys';

it('saves keys and inputs are password fields', async () => {
  render(<ApiKeysDialog open={true} onClose={() => undefined} />);

  const openai = screen.getByLabelText('OpenAI');
  const google = screen.getByLabelText('Google');
  const anthropic = screen.getByLabelText('Anthropic');

  expect(openai).toHaveAttribute('type', 'password');
  expect(google).toHaveAttribute('type', 'password');
  expect(anthropic).toHaveAttribute('type', 'password');

  await userEvent.type(openai, '1');
  await userEvent.type(google, '2');
  await userEvent.type(anthropic, '3');
  await userEvent.click(screen.getByText('Save'));

  const store = useApiKeysStore.getState();
  expect(store.getKey('openai')).toBe('1');
  expect(store.getKey('google')).toBe('2');
  expect(store.getKey('anthropic')).toBe('3');
});
