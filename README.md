# Kopel.AI

Skills and prompts for Claude, written in Hebrew, taken from real client work.

I'm Adi Kopel Levi, a product manager who builds AI solutions for businesses. These are instructions I wrote for my own agents. Each one is a single text file you can read in two minutes, copy into a chat, or install as a skill.

[לקריאה בעברית](README.he.md)

## What's inside

| Skill | What it does |
|---|---|
| [discovery-interview](skills/discovery-interview/SKILL.md) | Interviews a business owner before anything gets built. One question at a time, no solutions, and a short business case at the end. |
| [human-writing-he](skills/human-writing-he/SKILL.md) | Writing rules that keep Hebrew text from sounding machine-made: punctuation, openers, filler words, and a five-question check before sending. |
| [site-copy-he](skills/site-copy-he/SKILL.md) | Rules for Hebrew marketing copy, website content and on-screen text. Includes a test for generic sentences and patterns for buttons, errors and empty states. |
| [presentation-craft](skills/presentation-craft/SKILL.md) | How to build a deck people present instead of read: very little text per slide, plus a separate "what to say on each slide" script with delivery cues. |
| [save](skills/save/SKILL.md) | Closes a long Claude Code session: writes a handoff file, updates the task list, backs up to git, and returns a short prompt the next session starts from. |
| [council](skills/council/SKILL.md) | Convenes a panel of experts that attacks a plan before you build it. Each expert reviews on their own, and you get one risk report with a verdict: go, go with conditions, or stop. |
| [client-meeting-summary](skills/client-meeting-summary/SKILL.md) | Turns a transcript or meeting notes into a summary you can send to the client: what was decided, what happens now, and what is still open. |
| [rtl-hebrew](skills/rtl-hebrew/SKILL.md) | Hebrew and RTL rules: arrow direction, logical CSS properties, numbers that flip, and a check before delivery. |
| [i18n-toggle](skills/i18n-toggle/SKILL.md) | Two rules for the language toggle on a bilingual site: its position never moves, and the button order never changes. |
| [sticky-scroll-steps](skills/sticky-scroll-steps/SKILL.md) | A "how it works" section where scrolling switches the active step and the demo beside it. Ships with a React and Tailwind component, RTL and accessibility included. |
| [holiday-deck](skills/holiday-deck/SKILL.md) | A holiday presentation for kids as three HTML pages: the deck, a "what to say on each slide" sheet for the child presenting, and a trivia game nobody can lose. |

Also here: a [prompt for building your own skill](prompts/new-skill.md), [two prompts for the Claude Code insights report](prompts/insights.md), and a [Hebrew guide to Claude Code commands and flags](docs/claude-code-commands.he.md).

## My agents

Each agent has a name and a [card](agents/README.md) (in Hebrew) that says what it does, what you give it and what you get back.

- **Open to everyone:** [Mr Copy](agents/mr-copy.md) for marketing copy, and [Adula](agents/adula.md) for parents of babies up to one year old. The full instructions are in the repo.
- **By request:** Noga, Beni and Efrat, three agents that take you from an idea to a spec, one step each: discovery, business case, PRD. Request access from the cards page.

The skill files are in Hebrew. Claude follows them in any conversation language, and the structure is easy to adapt if you write in another one.

## Quick start

**Try one without installing.** Open a `SKILL.md`, copy everything below the header, and paste it at the start of a chat.

**Keep one in claude.ai.** Create a Project and paste the skill into the project instructions. Every chat in that project starts with it.

**Install in Claude Code.**

```bash
git clone https://github.com/kai12342026/Kopel.AI.git
```

```bash
cp -r Kopel.AI/skills/discovery-interview ~/.claude/skills/
```

Claude loads a skill when your request matches its description. Full instructions, in Hebrew: [docs/install.he.md](docs/install.he.md).

## How these are written

- **Plain text only.** No scripts, no downloads, nothing that runs. You can audit every skill by reading it. The one exception is `sticky-scroll-steps`, which ships a React component you copy into your own project.
- **Limits are written down.** Each skill says what it must not do, such as proposing solutions during an interview or pushing to a branch that triggers a deploy.
- **Short.** A skill costs attention every time it loads. Lines that don't change behavior are cut.
- **From real work.** Each one grew out of a client project or a lecture, and gets updated when it fails.

## If this helped

- **Star the repo.** It is how I know someone used it.
- **Tell me what you built.** Open a ["what I built" issue](https://github.com/kai12342026/Kopel.AI/issues/new?template=what-i-built.md) with a couple of lines. I read all of them.
- **Stay updated.** Watch the repo to hear about new skills. Every version is also a zip on the [Releases](https://github.com/kai12342026/Kopel.AI/releases) page.

## Credit and license

Written by Adi Kopel Levi. Licensed under [CC BY 4.0](LICENSE): use, adapt and share freely, including commercially, as long as you credit the author and link back to this repo.

`site-copy-he` adapts some patterns from Peter Yang's `no-ai-slop` (MIT).

Questions or ideas: open an issue, or write to kai.1234.2026@gmail.com.
