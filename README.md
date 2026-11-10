# Kopel.AI

Skills and prompts for Claude, written in Hebrew, taken from real client work.

I'm Adi Kopel Levi, a product manager who builds AI solutions for small businesses. These are instructions I wrote for my own agents. Each one is a single text file you can read in two minutes, copy into a chat, or install as a skill.

[לקריאה בעברית](README.he.md)

## What's inside

| Skill | What it does |
|---|---|
| [discovery-interview](skills/discovery-interview/SKILL.md) | Interviews a business owner before anything gets built. One question at a time, no solutions, and a short business case at the end. |
| [human-writing-he](skills/human-writing-he/SKILL.md) | Writing rules that keep Hebrew text from sounding machine-made: punctuation, openers, filler words, and a five-question check before sending. |
| [site-copy-he](skills/site-copy-he/SKILL.md) | Rules for Hebrew marketing copy, website content and on-screen text. Includes a test for generic sentences and patterns for buttons, errors and empty states. |
| [presentation-craft](skills/presentation-craft/SKILL.md) | How to build a deck people present instead of read: very little text per slide, plus a separate "what to say on each slide" script with delivery cues. |
| [save](skills/save/SKILL.md) | Closes a long Claude Code session: writes a handoff file, updates the task list, backs up to git, and returns a short prompt the next session starts from. |

Also here: a [prompt for building your own skill](prompts/new-skill.md).

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

- **Plain text only.** No scripts, no downloads, nothing that runs. You can audit every skill by reading it.
- **Limits are written down.** Each skill says what it must not do, such as proposing solutions during an interview or pushing to a branch that triggers a deploy.
- **Short.** A skill costs attention every time it loads. Lines that don't change behavior are cut.
- **From real work.** Each one grew out of a client project or a lecture, and gets updated when it fails.

## Coming next

- A business case agent that turns a messy description into problem, users, goals, constraints and success metrics.
- A spec agent that turns the business case into a PRD.
- A meeting transcript agent that returns a summary, tasks and a draft client message.

Watch the repo to get them when they land.

## Credit and license

Written by Adi Kopel Levi. Licensed under [CC BY 4.0](LICENSE): use, adapt and share freely, including commercially, as long as you credit the author and link back to this repo.

`site-copy-he` adapts some patterns from Peter Yang's `no-ai-slop` (MIT).

Questions or ideas: open an issue, or write to kai.1234.2026@gmail.com.
