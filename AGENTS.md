<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Localization
- Keep UI translations in a shared language context and dictionary; language controls share one preference so navigation and forms never diverge.
- Preserve stable English option values independently of translated labels so filters continue to match their data in either language.

## Accounts and learning
- Mount the language and account providers at the root with a single auth subscriber so public and protected screens share session and language state.
- Keep profile data and lesson completion in owner-scoped Cloud tables; derive percentages from unique completed curriculum steps rather than demo numbers.
- Define learning paths in the shared curriculum module so learning pages and profile totals use the same step identifiers.
- Keep account forms public and personal profile routes under the client-only authenticated layout because browser sessions cannot be read during SSR.
