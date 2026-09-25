# ESSENCE

ESSENCE is a light, editorial self-reflection experience inspired by *The Silent Spiral*. It includes an interactive landing page, a local conversational demo, a guided reflection, and an emotional-pattern view.

## Run locally

```sh
npm install
npm run dev:all
```

Create a production build with `npm run build`.

## Hugging Face chat setup

Copy `.env.example` to `.env` and set `HF_TOKEN` to a Hugging Face token with inference access. Keep `.env` private; it is ignored by Git. The Talk screen sends conversation history to the local Express API, which calls the Hugging Face Inference Router. The API key is never sent to the browser.

## Product notes

- Chat replies use Hugging Face when the local API is configured. Conversation history and reflection check-ins are not persisted.
- The visual system uses a warm white canvas, deep green ink, and selective coral, mint, lilac, and yellow accents.
- Keep layouts spacious and presentation-like, with short copy and responsive navigation.