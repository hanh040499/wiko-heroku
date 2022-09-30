# wiko

Wikipedia tool for researchers.

Priorities sorted:
- lists
- mobile friendliness
- accounts (only if you’re also using it)
- auto tracking (see last message)
- local ranking
- summary preview

With local ranking I had a look, it’s not often that an article repeatedly reference another page, usually they only reference the first time. We may need to do more research to see if this is true.

Some other useful heuristic may be:
1. Whether a linked page appears in the page as plain text (x number of times)
2. Or perhaps not even linked but was in the global list and mentioned as plain text x times
3. Whether it was linked in the summary section (instead of a sub section)
4. Article description, See also, read more, categories, special tables

Another thing I’m thinking is auto tracking a Wikipedia account through the api so if I read something on Wikipedia, the app auto adds it to the reading list where I can mark them as read or keep them in reading

Also can we hide all these identifier things

Oh and before I forget, backlinks would be helpful to see the articles / sentences referencing an article to provide additional context

