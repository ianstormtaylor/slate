> ⚠️ **This repository is a fork of [ianstormtaylor/slate](https://github.com/ianstormtaylor/slate) designed for GitBook. Before using this module, read this manifest and check out the initial repository.**

We have started using Slate for GitBook from its first days, contributing to its core and the ecosystem. But our usage of Slate as the main engine of our application requires some specificities that are not aligned with the common use cases of Slate.

As GitBook grew, performances and issues in Slate have deeply impacted our users, and our business.

The recent breaking changes require lot of work to keep up-to-date with Slate and they are not improving performances, and not necessarily bringing improvements to our usage.
We used to believe we could contribute to Slate and align it with our goals, but doing so requires too much work and political actions.

**We are not in any case criticizing Slate's community or the work Ian has done**. GitBook simply must focus on improving the experience of its users, which requires fixing core issues in our editor (mainly performances) that are impacting our business.

Our goal is not to replace Slate with our fork within the community. We do not expect people to use our fork. If you do, you should know that **we will not accept contributions that are not fully aligned with our goals**.

The focus on this fork will be **performance and stability**, we will not work on making it work for realtime collaboration or mobile edition. Our first project will be to redesign the schema from scratch, we will provide more details in the coming weeks.

Concerning our community plugins, they will be published under the `@gitbook` NPM scope, previous versions will stay on NPM as is (e.g. `slate-edit-list`).

The GitBook Team!
