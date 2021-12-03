import { render, screen, fireEvent } from '@testing-library/svelte';
import App from './App.svelte';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

it('has Load Random User button', () => {
  render(App);
  const loadButton = screen.queryByRole('button', {
    name: 'Load Random User'
  });
  expect(loadButton).toBeInTheDocument();
});
it('displays title, first and lastname of user', async () => {
  const server = setupServer(
    rest.get('https://randomuser.me/api', (req, res, ctx) => {
      return res(
        ctx.json({
          results: [
            {
              name: {
                title: 'Mr',
                first: 'Basar',
                last: 'Buyukkahraman'
              }
            }
          ]
        })
      );
    })
  );
  server.listen();
  render(App);
  const loadButton = screen.queryByRole('button', {
    name: 'Load Random User'
  });
  fireEvent.click(loadButton);
  const userFullName = await screen.findByText('Mr Basar Buyukkahraman');
  expect(userFullName).toBeInTheDocument();
});
