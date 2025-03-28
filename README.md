# Gland Framework Documentation

Welcome to the official documentation for **Gland Framework**, a lightweight and extensible web framework designed for modern JavaScript and TypeScript applications. Gland is built on an event-driven architecture (EDA), offering unmatched flexibility for creating modular, scalable, and maintainable server-side applications.

---

## Overview

Gland Framework is a revolutionary approach to web application development. Unlike traditional frameworks that rely on tightly coupled services and direct dependencies, Gland treats everything as an event, promoting an architecture where components are decoupled and interactions occur asynchronously. This design enables seamless scalability, making it easy to extend and maintain your applications.

With Gland, you can begin by handling HTTP requests, and as your application grows, you can effortlessly add WebSockets, RPC, or any other communication protocol simply by adding new event listeners. Its modular and protocol-agnostic structure allows you to adapt to various use cases without being locked into any particular system.

---

## Key Features

- **Event-Driven Architecture (EDA):** All interactions in Gland are event-driven, enabling components to communicate asynchronously. This reduces tight dependencies and enhances scalability.
- **Modular System:** Build applications in a modular fashion by combining independent modules, each responsible for specific functionalities such as routing, database access, or external integrations.
- **Protocol-Agnostic:** Gland does not bind itself to any particular protocol. You can start with HTTP and later switch to or add WebSockets, RPC, and other protocols without major changes to your application.
- **Minimalistic Dependency Injection (DI):** Gland features a lightweight DI system that helps manage dependencies without creating complex and tight relationships between components.

---

## Example

Here's an example of how to use Gland to create a simple HTTP-based application. This demonstrates how controllers emit events that are processed asynchronously by event listeners.

```typescript
import { Controller, Get, Module } from '@glandjs/common'
import { HttpContext } from '@glandjs/http'
import { GlandFactory } from '@glandjs/core'

@Controller('users')
class UserController {
  @Get('/')
  createUser(ctx: HttpContext) {
    const data = { id: 1, name: 'John Doe' }
    ctx.emit('user:created', { data, ctx })
  }
}

@Module({
  controllers: [UserController],
})
class AppModule {}

async function bootstrap() {
  const app = await GlandFactory.create(AppModule)
  app.listen(3000)
}
bootstrap()
```

### How It Works:

1. **Controller**: `UserController` receives an HTTP request and emits the event `user:created`.
2. **Event Handling**: The event is captured by an event listener, which processes the event asynchronously.
3. **Response**: After processing, the system sends the HTTP response back to the client.

---

## Contributing

We welcome contributions from the community! Whether you are fixing bugs, adding features, or improving documentation, your help is invaluable.

### Steps to Contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Implement your changes and write tests if needed
4. Open a pull request to merge your changes

We encourage contributors to follow best practices and ensure that their code adheres to the existing coding style and conventions used in Gland.

---

## License

Gland is open-source and licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Questions?

For any questions or issues, feel free to:

- Open an issue in the repository
- Join the community discussions on the [Gland Discord Server](https://discord.gg/nSMaEXkMUz)
- Visit the Gland documentation for additional guides and resources.
