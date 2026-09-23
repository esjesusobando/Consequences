<!--
source_type: youtube
youtube_url: https://www.youtube.com/watch?v=ZRM_TfEZcIo
youtube_video_id: ZRM_TfEZcIo
youtube_channel: AI Engineer
transcript_source: transcript_api
transcript_language: English (auto-generated)
transcript_language_code: en
transcript_is_generated: true
timestamp_interval_seconds: 60
generated_at: 2026-07-31T02:36:15Z
-->

# Turn 10,994 Notes Into Memory - Paul Iusztin, Decoding AI & Louis-François Bouchard, Towards AI

## Summary

This raw source contains the public YouTube caption transcript. It is not an LLM summary and may omit visual-only context that is not spoken in the video.

## Metadata

- URL: https://www.youtube.com/watch?v=ZRM_TfEZcIo
- Video ID: ZRM_TfEZcIo
- Channel: AI Engineer
- Transcript language: English (auto-generated) (en)
- Auto-generated captions: true
- Snippets: 1003

## Transcript

### 00:00

- [00:00] I spent 18 months turning my second
- [00:02] brain into my living research memory.
- [00:04] Let me explain.
- [00:05] So, within my second brain, I currently
- [00:07] have over 5,000 notes in Obsidian and
- [00:10] another 5,000 notes in Readwise and some
- [00:12] scattered in Notion and Google Drive.
- [00:15] And all of this is growing on every week
- [00:17] 250 files per month.
- [00:19] And this is what I want. On the left,
- [00:21] you can see my whole Obsidian vault,
- [00:23] this huge mass. And whenever I start
- [00:25] working on something such as an article,
- [00:27] a new project, a new code base, a new
- [00:29] feature, or whatever, I want to actually
- [00:31] pull high-signal notes that are actually
- [00:34] useful for my current work.
- [00:37] And you would ask yourself, why not use
- [00:39] directly Codex Cloud or Notebook LM? And
- [00:42] I think it's that I am. But you need a
- [00:44] system that sits between those harnesses
- [00:47] and your second brain. Okay, so let's go
- [00:50] back to the root of my problem, which is
- [00:52] that I'm always losing my research. For
- [00:54] example, my reading list is a graveyard.
- [00:57] When I'm scrolling social media and I
- [00:58] save that cool X post, a new article, a

### 01:00

- [01:01] new new YouTube video, a GitHub
- [01:03] repository, it doesn't matter. Whenever
- [01:05] I actually want to start working on
- [01:07] something, I never recall what I have in
- [01:09] my second brain or I have to spend a ton
- [01:12] of time actually finding meaningful
- [01:15] notes that I can use in my work, right?
- [01:18] And another problem that I have is that
- [01:20] I want the system to actually be
- [01:23] anchored into my personal notes, into my
- [01:25] personal values, into my personal faith.
- [01:27] I want the system to be personal to
- [01:30] reflect my own thoughts, right? And
- [01:32] that's why in today's video, Louis
- [01:34] François and I will teach you how to
- [01:36] build your own AI research OS. This also
- [01:39] comes with code, so you can also try it
- [01:41] out yourself.
- [01:43] And I'm Paul Yushin. I'm the founder and
- [01:46] CEO of Decoding AI, where I do a ton of
- [01:48] content on courses on how to ship AI
- [01:51] products. And I'm also the co-author of
- [01:52] the LM Engineers Handbook bestseller.
- [01:55] And the system, the AI research OS that
- [01:57] I will teach you in this video is the
- [01:59] system that I use in my daily work. And

### 02:00

- [02:01] now I will pass the torch to Luis
- [02:03] François.
- [02:05] >> Thanks, Paul. So, I'm Luis François
- [02:07] Bouchard. I'm the co-founder and CTO of
- [02:09] Towards AI, where we build educational
- [02:11] courses. And I'm also the creator of
- [02:14] What's AI, a YouTube channel where I
- [02:17] explain AI engineering techniques. I
- [02:19] used to explain AI research before.
- [02:21] Now, I'm focusing on AI engineering. I'm
- [02:24] also the author of the book Building AI
- [02:26] systems for production. And before that,
- [02:29] I was a PhD student. So, I honestly make
- [02:33] research for a living. I used to do a
- [02:35] PhD, as I said, in AI and doing tons of
- [02:38] research and research work. Now, I build
- [02:40] courses, I write videos, I research for
- [02:43] videos, I build trainings for companies
- [02:45] for a living. And all of these
- [02:48] things that I do start with a very good
- [02:51] research. And also leveraging tons of
- [02:55] knowledge and insights that we get at
- [02:58] Towards AI from building for clients.

### 03:00

- [03:01] So, I have tons of notes as well, just
- [03:03] like Paul. And we try to leverage them
- [03:06] the best possible.
- [03:07] And as you'll see, we'll build some sort
- [03:10] of tool to leverage our second brain,
- [03:12] where as you'll see, there will be some
- [03:14] differences between how I use it and how
- [03:16] Paul uses it. And that's the core goal
- [03:18] of the repository that we built and on
- [03:20] this project is that we want you to
- [03:23] adapt it for your needs. The whole goal
- [03:25] is how can we make research better, but
- [03:27] more specifically, how can we better
- [03:29] leverage what we have?
- [03:31] So, let's dive into it.
- [03:33] And first, we need to figure out which
- [03:35] tool to use and when, because this
- [03:37] whole
- [03:38] research system that we built is not for
- [03:41] every query.
- [03:42] If you just need a fast answer, like a
- [03:46] few quick questions or just
- [03:49] something where that that you would just
- [03:51] Google, basically. Well, obviously, just
- [03:53] Google it or ask ChatGPT, Cloud,
- [03:56] whichever system you want. But, the
- [03:58] problem when doing that is that if you

### 04:00

- [04:00] have a lot of following up question or
- [04:02] it's a bigger project that you need to
- [04:04] build on and have basically a very long
- [04:08] context or tons of information to share,
- [04:10] relying on ChatGPT isn't ideal. And it
- [04:12] also means that you are fully dependent
- [04:15] on the architecture that OpenAI or
- [04:18] ChatGPT's team built.
- [04:20] So, the next step here is to ask
- [04:21] yourself for a more complex problem, do
- [04:25] you need to act quickly or do you want
- [04:27] to build some next feature and and do
- [04:30] something very difficult? If you just
- [04:32] have a small repo for a quick change or
- [04:35] write one article, just do one thing
- [04:38] that you know won't be repeatable that
- [04:40] much, definitely use Codex or Cloud Code
- [04:43] or some agent that you trust. Sometimes,
- [04:46] you need to keep on digging to make it
- [04:47] better, to improve efficiency, optimize
- [04:50] it more. And so, typically, when you
- [04:52] have to do that, you want your research
- [04:55] sources, your research to stick and to
- [04:57] be able to refer to them in the future.

### 05:00

- [05:00] So, if you want a process like this
- [05:02] where the sources that you find, the
- [05:04] notes that you take stick around in time
- [05:08] and have an agent be able to leverage
- [05:10] that efficiently and being able to come
- [05:13] back to these information, to ask
- [05:15] follow-up questions, to digest content
- [05:17] even more. And right now, for instance,
- [05:19] when I make a new video, I want also the
- [05:22] agent and the system to understand the
- [05:24] previous videos I made to not duplicate
- [05:26] content, to not repeat myself, and to
- [05:28] refer to some other content.
- [05:30] In this case,
- [05:32] there are some tools that are very
- [05:33] interesting that you might have tried
- [05:35] before, like NotebookLM, that is super
- [05:37] powerful to do research, to digest
- [05:39] content efficiently, and to come back to
- [05:41] it. But, the problem with NotebookLM is
- [05:43] that is Well, first, the main problem is
- [05:45] that you don't own it. You cannot do
- [05:47] anything you want with it. You cannot
- [05:48] personalize as much as possible.
- [05:51] It's not agent native.
- [05:53] And it's obviously weak for coding tasks
- [05:56] since it's just
- [05:58] browser based. So, it's far from ideal

### 06:00

- [06:00] from something that Paul and I needed
- [06:03] and that most AI engineers need in
- [06:05] general.
- [06:07] So, if you need your agents to be able
- [06:09] to leverage all you do,
- [06:10] uh whether it is a big research,
- [06:13] a new video, whatever you write, you do,
- [06:15] you code, you typically want your other
- [06:17] agents, your other projects to be able
- [06:19] to leverage what you learn from what you
- [06:21] just did. And one thing that we advise
- [06:24] especially for production, obviously for
- [06:26] product, is to build some sort of
- [06:29] retrieval rag pipeline with vector
- [06:31] databases. But, this needs an
- [06:33] infrastructure. It's not really
- [06:36] human-friendly to be able to digest
- [06:38] quickly, to check notes, to make edits.
- [06:40] It's hard to inspect by hand. You need
- [06:42] to build everything around it. It's
- [06:44] definitely far from ideal for just
- [06:46] something I want to use on a daily
- [06:48] basis. Obviously, it's super powerful at
- [06:51] scale, very interesting especially in a
- [06:53] product. But, as I said, this project is
- [06:56] for us. And I don't want something live,
- [06:59] super professional as a product. I just

### 07:00

- [07:01] want something I will use and that my
- [07:03] agents and different projects can
- [07:05] leverage as best as possible.
- [07:08] So, the last question to ask ourselves
- [07:10] here is that
- [07:11] if you want everything there but more
- [07:14] personalization, so a personalized
- [07:17] research assistant
- [07:19] that builds some sort of Wikipedia that
- [07:22] compounds over time and and is easily
- [07:25] inspectable and usable where
- [07:28] you have tons of sources, documents,
- [07:30] videos,
- [07:32] comparisons, implementations,
- [07:34] new research, new topics that you keep
- [07:37] on adding and that you keep on wanting
- [07:39] to leverage and review easily, this is
- [07:42] where you may want to build something
- [07:44] yourself. And in our case, we built a
- [07:46] personalized research OS that we will
- [07:48] share
- [07:49] in this talk with exactly what we built
- [07:52] and how. But, the downside is that it
- [07:55] definitely needs a bit more setup than
- [07:57] just opening Cloud Code. Right now, the

### 08:00

- [08:00] main problem with using Cloud Code and
- [08:02] other agentic tool is that you give
- [08:04] Codex links, PDFs, and different
- [08:08] information, for example, my most recent
- [08:10] Loop Engineering video,
- [08:12] and then the next session you use Codex,
- [08:15] you have to paste it all again or ask it
- [08:18] to use skills.
- [08:19] And whatever structure that Codex or
- [08:22] ChatGPT, whatever tool that you use,
- [08:24] build on the fly to leverage what you
- [08:26] did, the scripts it ran, the scripts it
- [08:28] had, you all lost it or kept it inside a
- [08:31] skill that you have to ask it to reuse,
- [08:34] and that usually isn't ideal and just
- [08:36] grows and grows over time.
- [08:39] And the problem is that all this
- [08:41] information that you give to the model
- [08:43] is not the bottleneck. The bottleneck is
- [08:46] how can you leverage it in the future?
- [08:48] Meaning that with an agent, the context
- [08:50] window becomes everything, the database,
- [08:53] the file system, the memory, the
- [08:55] reasoning space. It has to do it all,
- [08:57] and when you stop the conversation, it
- [08:59] loses everything. And the thing is that

### 09:00

- [09:02] we don't need necessarily to provide
- [09:04] more and more and more context for a
- [09:06] better research. You need a proper
- [09:08] memory and context management, and
- [09:11] ideally some personality with it,
- [09:13] especially in my case when I do videos.
- [09:16] So, what we did is that we decided to
- [09:18] build a system with plain files, mostly
- [09:21] markdown files, that we can leverage
- [09:23] easily and that agents can leverage
- [09:25] easily. I won't detail it very much here
- [09:27] because Paul will talk about it in
- [09:29] depth.
- [09:30] And as I said, Paul has like 5,000 or
- [09:33] something notes. I have just a few
- [09:35] hundred, but that's just to say that we
- [09:37] need to consider that we didn't start
- [09:39] from nothing. We already both had some
- [09:42] sort of large database.
- [09:44] In my case, I made hundreds of videos
- [09:46] and I take many notes. So, I still need
- [09:50] to leverage these years of content that
- [09:53] I already made and tons of meetings that
- [09:56] I have with my team, with clients when
- [09:59] we build for them that I want to

### 10:00

- [10:01] leverage as well because we learn a lot
- [10:02] by building for people. We have
- [10:05] highlights from interesting tweets that
- [10:07] I see, interesting articles that I see,
- [10:09] and I want all my projects to be able to
- [10:12] leverage my agent skills. So, I decided
- [10:14] to pivot and instead of having a folder
- [10:17] for Cloud Code skills and having all my
- [10:19] meeting recaps in Granola and having
- [10:21] years of notes on Apple Notes and the
- [10:24] tweets on the saved Chrome tab, instead,
- [10:27] I moved everything automatically into
- [10:29] Obsidian. It's just a note reader,
- [10:32] obviously, so you don't have to use
- [10:33] that. You can just save it locally, but
- [10:36] I used Codex to set up everything so
- [10:38] that Granola is automatically saved
- [10:40] there, my notes are now on Obsidian just
- [10:42] because it's a nice UI, I like it, and I
- [10:45] can use it from my phone, my computer,
- [10:47] my Windows, Mac, everything. So,
- [10:49] anyways, I moved everything to Obsidian,
- [10:52] which means that it's saved locally in
- [10:54] my file system, which means it's
- [10:56] basically my companion for researching
- [10:58] and building everything I build now.

### 11:00

- [11:01] And what we built, obviously, leverages
- [11:04] that. We built a repo called AI Research
- [11:06] OS for this workshop where
- [11:09] it's basically just skills for Cloud
- [11:12] Code and Codex with plugins to be able
- [11:15] to do a very deep research about a topic
- [11:18] or a simpler search or distillation,
- [11:21] different tools that you can use. The
- [11:23] most useful and complete one will be the
- [11:25] research tool that I use, for example,
- [11:27] when I kick off a new video topic. And
- [11:30] the goal of this repo is to have you
- [11:33] implement it,
- [11:35] install the cloud plugins from it, and
- [11:38] tune it to your needs. Right now, it can
- [11:41] connect to, as I said, Obsidian with my
- [11:43] local notes. It can use Readwise,
- [11:46] Notebook LM, your GitHub repos, any
- [11:48] links that you send for GitHub or
- [11:50] YouTube videos, and
- [11:52] web links, obviously, and documents. But
- [11:55] there are tons of things missing, as we
- [11:56] will discuss in the end, that you can
- [11:58] easily implement, just asking Cloud

### 12:00

- [12:00] Coder or Codex to do so. Like for
- [12:02] example, I implemented the YouTube video
- [12:04] transcript in
- [12:05] honestly a few seconds, just one prompt.
- [12:07] It's super easy for Codex to implement
- [12:10] it. So, the thing is that this whole
- [12:13] repository and this whole project is a
- [12:15] very useful companion for my own work.
- [12:17] But, as I said, it implements tons of
- [12:20] features and state-of-the-art context
- [12:22] management and memory management
- [12:24] techniques that I believe AI engineers
- [12:27] need to know.
- [12:28] And now, Paul will dive into all this
- [12:31] three-layer system that we built with
- [12:33] the raw content, the index that I
- [12:35] mentioned, and the wiki-like
- [12:38] synthesized version of all your notes,
- [12:40] all your research, all your work. So,
- [12:42] he'll cover everything we did, how it
- [12:44] ended up, and show how to use it.
- [12:48] >> Okay. So, now I want to go over the
- [12:49] three versions of our system and how it
- [12:52] progressed over time, and most
- [12:54] importantly, why we added more
- [12:56] complexity.
- [12:58] So, in the first version,

### 13:00

- [13:00] we wanted to scope it just to create
- [13:02] lessons for our agent engineering
- [13:04] course. So, we wanted to keep it super
- [13:06] simple, where we had as input a topic
- [13:08] and a research MD as output. So, within
- [13:11] the input, we had the topic plus a set
- [13:14] of golden links, which were manually
- [13:16] handpicked by us.
- [13:17] We applied this deep research algorithm,
- [13:20] and we had as output a static research
- [13:22] MD file.
- [13:23] And if we go
- [13:25] zoom into the architecture,
- [13:27] we first scraped the links of the golden
- [13:31] links, right? Because we already know
- [13:33] them and we use them as seed for context
- [13:36] for the deep research algorithm, which
- [13:38] was a really powerful technique because
- [13:40] we had more context on how to frame our
- [13:43] questions.
- [13:45] And during the query rounds, we
- [13:47] basically used the very classic deep
- [13:49] research algorithm where we had one main
- [13:52] agent, the orchestrator, which created
- [13:54] multiple questions based on the
- [13:57] initial topic and the scraped context.

### 14:00

- [14:00] And each agent managed its own question
- [14:04] and used Gemini grounded in Google to to
- [14:07] query basically Google and gather
- [14:09] multiple resources and each
- [14:11] agent gather these resources, which
- [14:15] returned multiple links and created some
- [14:17] executive summaries of each link. And
- [14:20] then [snorts] it passed all this
- [14:21] information back to the agent to the
- [14:24] main agent where the main agent
- [14:26] basically aggregated all this
- [14:28] information into a summarized way so it
- [14:32] did not exploded the context. And we did
- [14:35] this for three rounds. So basically
- [14:37] after three rounds of generating six
- [14:40] queries per round, we ended up with like
- [14:42] 40-50 links in total.
- [14:46] So you can imagine that there's a lot of
- [14:48] noise over there. So that's why we also
- [14:51] applied a ranking algorithm where we
- [14:53] wanted to like find
- [14:56] the the information with the highest
- [14:58] signal. And basically we compared each

### 15:00

- [15:01] source against the topic, the initial
- [15:03] topic of the user. And like that, we
- [15:06] fully scraped only the top K elements
- [15:09] based on the ranking score. And for the
- [15:11] rest of the of the links, we just kept
- [15:15] the summaries. And then we compiled
- [15:17] everything into this research MD file as
- [15:20] a single flat file which we used for
- [15:23] each lesson of our course in in our
- [15:25] particular use case.
- [15:27] But as you can imagine, it was pretty
- [15:29] limited. For the course, it worked great
- [15:31] right away. We generated 35 lessons
- [15:34] really quick, but we wanted more. So, we
- [15:38] started to aim this deep research loop
- [15:42] to the
- [15:43] second brain as well, right? Before, it
- [15:46] was targeting only the public web, which
- [15:48] made this a pretty generic, and we had
- [15:52] to manually find all those golden links.
- [15:55] So, by aiming this deep research loop to
- [15:58] the second brain, where we basically

### 16:00

- [16:01] organically keep track of all the
- [16:04] information that of all the research
- [16:06] that we really want and is filtered by
- [16:09] us,
- [16:10] we can organically gather all those
- [16:13] golden rings
- [16:14] into our deep research algorithm.
- [16:17] So, let's look at how this new algorithm
- [16:20] looks like. It's basically the same
- [16:22] loop, right? But now we target our own
- [16:25] sources instead of just the public web.
- [16:28] Now, for input, we have only the topic
- [16:30] because we don't need the golden links.
- [16:32] As I said, the golden links are actually
- [16:34] a reflection of our second brain system.
- [16:38] In theory, you can also add them if you
- [16:39] really want to, but that's the beauty of
- [16:42] this new strategy because you can just
- [16:44] put as input some topic and we'll find
- [16:47] everything that it needs.
- [16:48] And then we use this topic only as seed
- [16:52] for for for the context to generate the
- [16:55] the queries. And now we do the same deep
- [16:58] research algorithm, right? The same

### 17:00

- [17:00] query rounds, but instead of targeting
- [17:03] only the public web, now we plugged in
- [17:06] all our second brains, such as the our
- [17:08] Obsidian, our Readwise, our Notebook LM,
- [17:10] our GitHub. You can also use, for
- [17:12] example, Gemini deep research for this,
- [17:15] like similar to how we we use notebook
- [17:17] LM or you can extend this with whatever
- [17:20] you want. For example, YouTube, uh
- [17:22] Google Drive, Notion, or whatever makes
- [17:25] sense on your infrastructure. The idea
- [17:27] is that now we are target our queries
- [17:31] from the deep research algorithm to our
- [17:33] second brain plus the public web.
- [17:36] And after we apply the same algorithm
- [17:39] such as ranking, fully scraping,
- [17:40] summaries, and compile everything into
- [17:43] this research MD file.
- [17:45] But now we have another problem, right?
- [17:48] This this research MD file is static.
- [17:50] It's a pile of static data. And usually
- [17:54] research is not static, right? So, after
- [17:56] you end up with with this file, you most
- [17:59] often realize

### 18:00

- [18:00] that you want to ask another question or
- [18:03] some information is stale and you don't
- [18:05] need it anymore. Or or basically, you
- [18:07] want more out of this research MD file.
- [18:10] And we which means that you need to
- [18:11] start all of this from scratch. And the
- [18:14] operation that I showed you uh above is
- [18:16] an extensive operation. It consumes a
- [18:19] lot of tokens and it takes a lot of
- [18:20] time. So, you don't want to run it from
- [18:23] scratch.
- [18:24] And that's why you need to add a wiki
- [18:26] layer on top of it.
- [18:28] And that's why V3 of this system is
- [18:31] actually a deep research algorithm
- [18:33] plus an LM knowledge base on top of it,
- [18:36] aka the wiki layer.
- [18:38] So, the new algorithm looks like this.
- [18:41] So, we have sources in and a wiki out.
- [18:45] And the sources, as I said before, can
- [18:47] be like Obsidian, notebook LM, Google
- [18:49] Drive,
- [18:50] or YouTube, Notion, even custom URLs,
- [18:53] right? That that's also powerful as
- [18:54] well, where you use tools such as
- [18:56] a Bright Data to to parse basically any
- [18:59] single page application, any type of

### 19:00

- [19:01] site, any type of public information
- [19:04] that's out there. We can put it in. And
- [19:06] then you apply the same deep research
- [19:07] algorithm.
- [19:09] You store everything into raw files,
- [19:12] right? Instead of compiling everything
- [19:14] into research and D file, now we store
- [19:16] each file individually.
- [19:19] And we create an index out of all these
- [19:21] files.
- [19:23] And ultimately, we generate a wiki on
- [19:25] top of it, and which we can query. We
- [19:28] can query basically the wiki plus the
- [19:30] index. Okay, so this is just the
- [19:32] high-level architecture of the new
- [19:34] system. Let's zoom into it.
- [19:37] So, what do I want to start with is that
- [19:38] you should forget the infra structure
- [19:40] you think you need, such as vector
- [19:43] databases, knowledge graphs, semantic
- [19:45] search, text search.
- [19:47] All that is beautiful, but add a lot of
- [19:50] complexity, especially for like this
- [19:52] personal wikis, personal research
- [19:54] operating systems that you want to use
- [19:57] very lightly. So, I want a system just
- [19:59] based on files, right? A simple

### 20:00

- [20:02] mechanism that's that's very rooted into
- [20:04] how your computer works.
- [20:06] And that's why we'll create all the
- [20:08] system just based on files and just
- [20:10] based on references.
- [20:12] So,
- [20:13] no database, just a simple index based
- [20:15] on references. And how how this works?
- [20:18] We have an agent
- [20:20] that reads an index.yaml file that's
- [20:23] basically a catalog of your all your
- [20:25] data plus the summaries of of each
- [20:27] source and some metadata around it. For
- [20:30] example, here on the right, you can see
- [20:33] part of an index.yaml file that contains
- [20:36] 10 sources and 38 wiki pages as
- [20:39] derivatives
- [20:40] of these sources, where uh we can see
- [20:43] there into the sources list of the YAML
- [20:45] file the first uh source, for example.
- [20:47] And as you can see, it has like the the
- [20:49] the link to the original file plus some
- [20:51] metadata, such the origin, the title,
- [20:54] the authors, the the the publication
- [20:56] date, the summary, and and things things
- [20:58] like this, which can be flexible, right?

### 21:00

- [21:01] And the next step is that based on this
- [21:04] index.yaml file, we need to point to all
- [21:07] the wiki pages, to all the wiki
- [21:09] derivatives, to all the raw sources. So,
- [21:11] basically, this index.yaml file is an
- [21:14] entry point for our agent, right? It's
- [21:17] what we will give to our agent to
- [21:19] actually reason on how to find our data.
- [21:23] It's an index, ultimately, right?
- [21:26] So, the next step is to understand how
- [21:28] the wiki actually looks like. So, on the
- [21:31] left, you can see the high-level
- [21:32] structure of the wiki, where we have the
- [21:34] raw folder, the wiki folder, and the
- [21:37] index. In the raw folder, we actually
- [21:39] just have the raw data, which is
- [21:41] immutable. You don't want to touch that.
- [21:43] The And the index points to everything
- [21:45] that we need. And in the wiki, we
- [21:47] actually have derivatives created by the
- [21:49] LLM, which contains things such as
- [21:52] comparisons between multiple concepts,
- [21:54] entities, or just simple notes as a
- [21:56] reflection of our questions or
- [21:59] repositories that we ingested, and we

### 22:00

- [22:01] can create multiple notes based on a on
- [22:03] on a repository, right? Or open
- [22:06] questions that based on our questions
- [22:08] that LLM couldn't answer yet. And
- [22:11] everything that you can analyze on top
- [22:14] of your raw data.
- [22:16] And on the right, based on Obsidian, we
- [22:18] can see like the sub graph reflected
- [22:20] just based on in this index. And this is
- [22:23] just like the first iteration, but as
- [22:26] the the the the wiki grows, you can see
- [22:29] connections made between entities and
- [22:31] concepts. For example, concepts are
- [22:33] things such as tool registry, context
- [22:36] compaction, sandboxing, or entities are
- [22:39] open code, closed code, MCP, right? So,
- [22:42] as you can see,
- [22:43] you can beautifully can start visually
- [22:46] and practically create connections.
- [22:49] Now, the next obvious question is how do
- [22:51] we actually query this wiki? So, as I
- [22:54] said, the agent will have as input this
- [22:57] index.yaml file, which contains
- [22:59] summaries and metadata about

### 23:00

- [23:03] each source. But what happens next,
- [23:06] right? The next step is actually to look
- [23:08] into the source wiki page. Where the
- [23:11] source wiki page is like an executive
- [23:13] summary of each page. Which is basically
- [23:16] not just a summary, but a more expanded
- [23:19] summary of of each source. And sometimes
- [23:22] the agent just looks into this, gets
- [23:24] what it needs, and goes back. Which is
- [23:26] very token efficient, right?
- [23:29] And if it doesn't find
- [23:31] within this uh source wiki page, we also
- [23:33] need links into the wiki derivative,
- [23:36] such as concepts, entities, notes,
- [23:38] comparisons, and so and so forth.
- [23:41] And only if it doesn't find the
- [23:43] necessary information up to this point,
- [23:46] it needs and it actually reads the whole
- [23:48] raw source, right? Which basically
- [23:50] contains the whole article, the whole
- [23:52] paper, the the the whole video, or
- [23:54] whatever. And this makes just through
- [23:56] pure referencing and creating this
- [23:59] simple hierarchy, this makes everything

### 24:00

- [24:01] very token efficient. Now, the beautiful
- [24:04] part is that this wiki is actually
- [24:06] alive, right? For example, every
- [24:08] question leaves a trace into your wiki.
- [24:11] So for every question, the LLM can
- [24:13] create a new concept file, a new notes
- [24:16] [snorts] file, a new comparison file.
- [24:18] And every question is is tracked into a
- [24:20] log. So basically, the the the wiki
- [24:23] doesn't evolve only when you ingest new
- [24:26] data or do a deep research round, it
- [24:28] actually evolves as you start talking
- [24:31] with it, right? That's the beautiful
- [24:32] part, actually. And like that, you can
- [24:35] see a true reflection of of yourself, of
- [24:38] what you haven't understood, of all your
- [24:40] questions from the past. And the
- [24:42] beautiful part is that the the wiki is
- [24:45] never frozen, right? Similar to the
- [24:46] research entity files. At any point, you
- [24:49] can ingest a new custom link that you
- [24:51] think that you need into the wiki, or
- [24:53] even run a new deep research round. Or
- [24:55] as I said previously, the wiki keeps
- [24:57] evolving just purely based on your
- [24:59] questions.

### 25:00

- [25:01] And another important thing to
- [25:03] understand is that this wiki doesn't sit
- [25:06] on top your of your entire second brain,
- [25:09] right? For example, in my particular use
- [25:10] case, I use the PARA method coined by
- [25:14] Tiago Forte where all my data is
- [25:16] structured between project, areas,
- [25:18] resources, and archive. Where all my
- [25:21] notes resources that I save, sources
- [25:24] that I save yet article or whatever are
- [25:26] just piped directly to the resource a
- [25:28] flat list. And whenever I need
- [25:31] something, I just references them
- [25:34] into projects and areas, right? And like
- [25:37] this, Obsidian is just an immutable
- [25:40] snapshot that a LLM never touches,
- [25:43] right? So, this is my data. I don't
- [25:44] really want the LLM to touch my personal
- [25:48] notes that I manually write, right? So,
- [25:51] then how can we actually put this wiki
- [25:53] to use, right? So, as I said, we have
- [25:56] the big Obsidian snapshot which is our
- [25:59] global second brain.

### 26:00

- [26:02] And then
- [26:03] whenever we start to work on a new
- [26:05] project, we reference this second brain
- [26:08] through this deep research algorithm
- [26:10] that I explained, and we scope it down
- [26:13] to our own project, right? So,
- [26:15] basically, whenever we want to start
- [26:16] working on something, we run this deep
- [26:19] research loop or we start ingesting some
- [26:22] particular repositories, articles,
- [26:24] notes, and so on and so forth.
- [26:26] And
- [26:27] we usually do that through a set of
- [26:29] skills plugged into a harness.
- [26:32] And a project can be basically anything
- [26:34] such as writing a new article, doing a
- [26:36] new video, doing a set of slides. I I
- [26:38] applied this technique doing this slide.
- [26:41] Or you can even apply it for something
- [26:43] more complex such as writing a book,
- [26:46] doing a course, or or keeping track of a
- [26:48] whole code base, right? You can also you
- [26:51] use it for that. So, basically, a
- [26:53] project can be anything where you want,
- [26:55] as I said initially, to transform
- [26:57] research into work.

### 27:00

- [27:00] The project is the work, and your second
- [27:02] brain is the research.
- [27:04] So, now I want to show you a few demos.
- [27:06] So, what you need to do is go to the AI
- [27:08] research OS workshop repository, and
- [27:11] here you can find all the skills
- [27:13] required to run what we presented into
- [27:15] this presentation.
- [27:17] And everything is packed as a cloud code
- [27:19] plugin, but you can very easily tweak it
- [27:21] and install it with any other harness.
- [27:24] And also in the read me, you can find
- [27:25] details on how to install all all the
- [27:28] other dependencies, because the thing is
- [27:29] that this system is dependent on tools
- [27:31] such as Obsidian, Readwise notebook
- [27:33] elements, and so on and so forth. So,
- [27:35] you need to set up specific CLIs or
- [27:37] authentication issues. But, I don't
- [27:39] really want to waste any of your time
- [27:41] with setup issues, and I want to go
- [27:43] straight directly into the examples. So,
- [27:45] I prepared here three examples. The
- [27:48] first one is a research on one of my
- [27:51] previous articles on agentic AI
- [27:53] engineering, and within these files, I
- [27:55] have a brand dump of everything that I
- [27:57] knew I wanted to talk on this subject.

### 28:00

- [28:00] And on top of that, I also added a few
- [28:02] references that I knew 100% that I want
- [28:05] to add into this wiki.
- [28:08] And what we need to do to actually
- [28:10] trigger the the algorithm on top of
- [28:12] these files is to open up a cloud
- [28:15] session, and then just call the skill,
- [28:17] the research skill, and point it it to
- [28:19] this file. And that's it. Everything
- [28:22] else is baked directly into the skill.
- [28:24] It will understand my intent that I want
- [28:27] to create a wiki
- [28:28] on agentic harness engineering just
- [28:30] looking at these files and looking at
- [28:32] the topic, and it will know that before
- [28:34] starting the deep research algorithm, it
- [28:36] actually needs to scrape this
- [28:38] information to to use it as context when
- [28:41] it frames the questions for the deep
- [28:43] research algorithm.
- [28:44] Now, we need to wait a bit for for the
- [28:47] agent to reason on top of it.
- [28:49] And I will actually just put it on auto
- [28:51] mode to speed speed this up, right? I
- [28:54] use this hundreds of times, so I know it
- [28:56] won't delete anything from my computer
- [28:58] or it won't do anything weird. Okay, so

### 29:00

- [29:02] now this is the most important part,
- [29:04] right? So, it asked me how deep I want
- [29:07] the deep research algorithm to be.
- [29:09] We have light, deep, fast. This mostly
- [29:12] controls how many questions you want to
- [29:15] run per one round and how many rounds
- [29:18] you want to run. And usually light or
- [29:21] fast is more than enough because
- [29:23] remember this process consumes a lot of
- [29:26] tokens. So, you kind of need to do the
- [29:29] deep one only when you you really want
- [29:32] to look over tons and tons of notes. And
- [29:36] for this use case, I will just pick the
- [29:38] light one to to to speed this up. And in
- [29:40] this use case, it just does one round of
- [29:42] three queries, right? And for the
- [29:46] fast one, it does two rounds of three
- [29:48] queries. So, I would just keep it keep
- [29:50] it around that spectrum.
- [29:52] And now the process
- [29:55] will will take around 10 to 20 minutes
- [29:58] to actually look around my Obsidian, to

### 30:00

- [30:00] look around my Readwise, my Notebook LM,
- [30:03] and run those queries on top of this.
- [30:05] And I actually run this, right?
- [30:09] And now let's open this wiki that we
- [30:11] created based on the prompt before in
- [30:13] Obsidian and let's look what's inside
- [30:16] the the wiki.
- [30:17] So, we have three big objects, the raw
- [30:21] files, which are basically a raw copy of
- [30:24] what we found, the index,
- [30:27] which contains all the references to
- [30:30] towards the wiki, right? We can also in
- [30:32] Obsidian have this beautiful a subgraph
- [30:35] where we can very quickly understand
- [30:36] what is going on. This is created purely
- [30:39] based on this this file.
- [30:41] And then the most interesting part is
- [30:43] inside the wiki.
- [30:45] Where we have comparisons,
- [30:48] concepts, entities,
- [30:51] and sources. The sources contain the
- [30:53] executive summary of of our raw sources.
- [30:56] So, the LLM doesn't really need to every
- [30:59] time when it reads them, and it needs

### 31:00

- [31:01] them to to read the raw sources, but it
- [31:04] needs just the executive summaries,
- [31:06] which are computed just one time during
- [31:08] the ingestion. And for example, for the
- [31:11] comparisons, it understood out of the
- [31:13] box that it needs to do comparisons
- [31:15] between like adjective rag versus file
- [31:17] systems or compaction versus recursive
- [31:20] language models or or or anything of
- [31:22] interest
- [31:23] based on on the sources. And the most
- [31:26] interesting part is actually the
- [31:27] concepts. So, it automatically extracted
- [31:30] all the
- [31:31] concepts that we need to understand from
- [31:33] this pile of resources. For example, if
- [31:36] we open the agent loop resources, we
- [31:38] automatically
- [31:41] can look and get this beautiful summary
- [31:43] containing like graphs, tags, and
- [31:45] explaining us everything that we need on
- [31:47] this topic. And we can do the same on
- [31:50] all the concepts from from from this
- [31:52] wiki or
- [31:54] all the entities from the wiki and so
- [31:57] and so forth.
- [31:58] Okay, so now let's go to the second
- [31:59] example.

### 32:00

- [32:01] It It's a simple example where I want to
- [32:03] learn more on harness engineering and
- [32:05] how harnesses work. So, in in this
- [32:08] prompt over here, I just want to ingest
- [32:11] the three open source repositories on
- [32:13] open code, Pi, and Hermes.
- [32:16] And I don't want to do deep research at
- [32:18] all, right? I just want to ingest those
- [32:20] repositories and explore topics such as
- [32:24] the general architecture, agents
- [32:25] architecture, sub agents, memory system,
- [32:28] and the agent permission flow. And let's
- [32:32] run the research on top of this prompt.
- [32:35] And now what the research will do will
- [32:38] clone automatically all these
- [32:39] repositories
- [32:41] and will explore all the repositories on
- [32:44] the topics that I gave here
- [32:46] and it will create notes at the
- [32:48] individual level of each repository on
- [32:50] how they work, on how how the
- [32:52] architecture works at the repository
- [32:55] level and then we can create higher
- [32:57] level notes, right? Within the wiki
- [32:58] derivatives and compare all the

### 33:00

- [33:01] architectures or create aggregate
- [33:03] architectures on on like the general
- [33:06] trends of all those harnesses and
- [33:08] basically explore and learn everything
- [33:11] that we want about harness engineering
- [33:13] directly from the code.
- [33:15] And again, usually I just do auto mode
- [33:18] and let it do its own gist, but I
- [33:21] already run this, right? So here is the
- [33:23] wiki for these GitHub repositories
- [33:26] and again, we have the raw files and we
- [33:30] have the index and the wiki.
- [33:33] And here probably within the repos we
- [33:36] can see all the three repositories and
- [33:39] for example, inside the open core
- [33:40] repositories we can see empty files
- [33:43] explaining everything that we need on
- [33:46] particular topics such as the permission
- [33:48] flow, the memory system and so on and so
- [33:50] forth and we can see this in all the
- [33:53] other repositories and the most
- [33:55] interesting part here is actually that
- [33:57] we have comparisons on all of these,
- [33:59] right? So we can actually understand the

### 34:00

- [34:02] differences
- [34:03] within the architecture within these
- [34:05] harnesses or
- [34:07] we also have all the concepts extracted
- [34:09] from these repositories and we can
- [34:11] understand what are the key
- [34:13] architectural decisions from these
- [34:15] repositories.
- [34:17] So we can go crazy with this and this is
- [34:19] super useful if you want to, for
- [34:21] example, write your own harness.
- [34:24] And the third examples is the simplest
- [34:27] one in in reality, which is just based
- [34:30] on ingesting some some simple links,
- [34:33] right? And again, I will just exit the
- [34:35] the previous run and
- [34:38] I want to run this example from scratch.
- [34:41] And here,
- [34:43] I just want to show you that you can use
- [34:45] this
- [34:46] also with a very basic setup where I
- [34:49] just want to ingest three custom random
- [34:51] links.
- [34:52] And as before, I just pass this prompt
- [34:57] and it will start the research process.
- [34:59] And I want to highlight that you can run

### 35:00

- [35:01] example two ending on the GitHub
- [35:03] repositories and this example without
- [35:06] any other setup like without setting up
- [35:08] Obsidian, Readwise, or anything else.
- [35:10] You can just install this plugin and run
- [35:12] this examples because it here is not
- [35:15] dependent on any other service than Git
- [35:17] and using curl to get this this URLs.
- [35:21] And again, here if we go into Obsidian
- [35:24] and explore the wiki created out of this
- [35:27] example three,
- [35:29] we we can see the index, we can see the
- [35:32] wiki itself
- [35:33] with all the sources, right? One
- [35:35] executive summary for for each source
- [35:37] and all the concepts, extracted
- [35:40] entities, and so on and so forth.
- [35:42] And the idea is that as you start asking
- [35:44] questions on top of this, everything
- [35:47] starts to get more interesting. So now,
- [35:49] let's assume that we want to ask for
- [35:50] example a question on harness
- [35:52] engineering based on the wiki created
- [35:54] out of the GitHub repositories. So what
- [35:57] we have to do is just again hit the
- [35:59] research field

### 36:00

- [36:01] pointed to the
- [36:04] wiki that we just created,
- [36:06] and then just ask our question. And
- [36:09] let's assume that I want to learn more
- [36:12] on sandboxing,
- [36:15] more exactly how
- [36:17] remote
- [36:19] sandboxing works and how is
- [36:23] plugged into the heart.
- [36:26] This can be basically any any any other
- [36:29] question. And
- [36:30] now what it will happen, it will
- [36:33] basically query this wiki, it will give
- [36:35] you an answer, and
- [36:38] based on this, you can also start
- [36:41] creating notes, comparisons, or maybe it
- [36:43] will extract and find new entities that
- [36:45] you care about. So basically, it will
- [36:47] start updating the wiki.
- [36:49] >> All right. So now, where is this project
- [36:52] going? What is it? What should you do?
- [36:54] First, it's still rough at some points.
- [36:57] Like it needs more connectors, as you
- [36:58] saw. We need to add Google Drive,

### 37:00

- [37:00] Notion, Slack, and tons of other
- [37:02] connectors that could be useful to you.
- [37:04] But to be honest, it's not really useful
- [37:06] to me and my current workflow or to
- [37:07] Paul. So we didn't add them yet, because
- [37:10] the core of this project is to be useful
- [37:12] for us and for you to take over and add
- [37:14] whatever you need. And the other main
- [37:16] goal of this project is to teach memory
- [37:19] and context management. So all these
- [37:21] extra features aren't really useful
- [37:24] towards that purpose. There are other
- [37:26] some weaknesses, like it's hard to know
- [37:28] which sources are outdated or weak or
- [37:31] strong compared to some other system
- [37:33] that we built. So we know we can improve
- [37:35] this, but again, it's not really the
- [37:37] priority here. And lastly, it's still
- [37:40] obviously a builder workflow. You use it
- [37:42] through cloud code and Codex, and it's
- [37:44] just to me in the terminal and I just
- [37:46] really like it. So it's not a final
- [37:49] polished product with a nice UI, nice
- [37:51] UX. And honestly, that's by design. So
- [37:54] we don't really care about this, because
- [37:56] our goal is to teach AI engineering.
- [37:58] It's not to build the next best product.

### 38:00

- [38:02] Still, we have a few next improvements
- [38:04] we want to do very shortly, from having
- [38:07] a stronger linting to a better memory
- [38:10] compaction, because that's a big issue
- [38:12] and it's just very complicated in
- [38:13] general to manage memory correctly, and
- [38:16] the state of the art is always
- [38:17] progressing there. We, as I said, need
- [38:19] better source provenance to trust the
- [38:21] sources and be able to rank them
- [38:24] properly and reuse them properly if
- [38:26] needed and be able to know access
- [38:28] quickly as a user if this source is
- [38:31] relevant or not.
- [38:33] And we have other
- [38:35] next improvements to do.
- [38:37] But those are mostly for optimization
- [38:39] and for the future. And the thing is
- [38:41] that we actually build all of that into
- [38:44] another product that
- [38:47] you can even build yourself.
- [38:49] Because we created a course called Agent
- [38:51] Engineering
- [38:53] where we build a similar deep research
- [38:55] system with a writing and research agent
- [38:58] where we build a system with the same

### 39:00

- [39:00] goal to be able to learn best AI
- [39:03] engineering practices. It's a very
- [39:05] in-depth course where I assume it takes
- [39:07] around 60 hours to complete with a final
- [39:09] project being the multi-agent system I
- [39:11] just described that you'll build for
- [39:13] yourself. So if this presentation and
- [39:16] the demo repo that you saw was
- [39:18] interesting, please consider checking
- [39:20] out the Towards AI Academy with our
- [39:23] courses on there including the Agent
- [39:25] Engineering course to learn more on the
- [39:27] best practices when building around and
- [39:30] with agents.
