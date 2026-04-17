import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'

const root = fileURLToPath(new URL('../site/out', import.meta.url))
const port = Number(process.env.PORT || '3101')

const server = createServer((request, response) => {
  void handler(request, response, {
    cleanUrls: true,
    directoryListing: false,
    public: root,
  })
})

server.listen(port, () => {
  console.log(`Playwright server listening on http://localhost:${port}`)
})
