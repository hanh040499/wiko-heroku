import { nodeState } from "../endpoints.js";
import store from "../store.js";

function getPageContentUrl(page) {
  return encodeURI(
    "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=" +
      page +
      "&redirects&origin=*"
  );
}

function toTitleCase(input) {
  if (!input) return "";
  const text = input.charAt(0).toUpperCase() + input.slice(1);
  return text.split(" ").join("_");
}

export default {
  name: "Main",

  data() {
    return {
      titleInput: "",
      articleTitle: "",
      articleColor: "",
      sections: { _Summary: [] },
      sectionName: "_Summary",
      index: 0,
      showExploreCard: false,
      showDashboard: false,
      startToReadArticles: [],
      readLaterArticles: [],
    };
  },

  methods: {
    handleSubmit(event) {
      const titleInput = document.getElementById("main-input").value;
      if (!titleInput.trim()) return;
      this.$router.push(`/wiki/${toTitleCase(titleInput)}`);
    },

    handleClear(event) {
      document.getElementById("main-input").value = 0;
    },

    getWikiUrl(title) {
      return encodeURI("https://en.wikipedia.org/wiki/" + title);
    },

    async handleGoToTableOfContent() {
      this.index = 0;
      this.sectionName = "_toc";

      await fetch(
        nodeState.updateNode({
          user_id: store.me.id,
          type: "article",
          title: this.articleTitle,
        }),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: 0,
            section: "_toc",
          }),
        }
      );
    },

    async handleClickContextMenu(anchor) {
      const ctxMenu = document.getElementById("ctxmenu");
      if (ctxMenu) {
        ctxMenu.outerHTML = "";
      }
      const anchorHref = anchor.getAttribute("href");
      const anchorTitle = anchorHref.slice(8);

      const articleResult = await fetch(
        nodeState.getArticle({
          user_id: store.me.id,
          type: "article",
          title: anchorTitle,
        })
      );
      const parseArticleResult = await articleResult.json();
      if (!parseArticleResult.data) {
        fetch(nodeState.createNode(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: store.me.id,
            type: "article",
            title: anchorTitle,
            state: "read_later",
            index: 0,
          }),
        });
      } else {
        fetch(
          nodeState.updateNode({
            user_id: store.me.id,
            type: "article",
            title: anchorTitle,
          }),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              state: "read_later",
            }),
          }
        );
      }
    },

    handleClickCard() {
      const ctxMenu = document.getElementById("ctxmenu");
      if (ctxMenu) {
        ctxMenu.outerHTML = "";
      }
    },

    handleOpen(event) {
      const titleInput = document.getElementById("main-input").value;
      if (!titleInput.trim()) return;
      const normalized = toTitleCase(titleInput);
      window.open(this.getWikiUrl(normalized));
    },

    viewCurrentArticle(currentArticle) {
      const title = currentArticle.split(" ").join("_");
      this.$router.push(`/wiki/${title}`);
    },

    async getDashboardData() {
      const startToReadResult = await fetch(
        nodeState.getArticles({
          user_id: store.me.id,
          state: "started_to_read",
        })
      );
      const readLaterResult = await fetch(
        nodeState.getArticles({
          user_id: store.me.id,
          state: "read_later",
        })
      );
      const parseStartToReadResult = await startToReadResult.json();
      const parseReadLaterResult = await readLaterResult.json();
      const startToReadData = parseStartToReadResult.data.map((data) => {
        return data.title.split("_").join(" ");
      });
      const readLaterData = parseReadLaterResult.data.map((data) => {
        return data.title.split("_").join(" ");
      });

      return {
        startToReadData,
        readLaterData,
      };
    },

    async previousParagraph() {
      if (this.index === 0) return;
      this.index = this.index - 1;
    },

    async nextParagraph() {
      if (this.index === this.sections[this.sectionName].length - 1) {
        await this.handleGoToTableOfContent();
        return;
      }

      fetch(
        nodeState.updateNode({
          user_id: store.me.id,
          type: "article",
          title: this.articleTitle,
        }),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: this.index + 1,
            section: this.sectionName,
          }),
        }
      );
      this.index = this.index + 1;
    },

    async viewArticle(titleInput) {
      this.sections = {};
      this.sectionNames = "_Summary";
      this.index = 0;
      this.articleColor = "";

      const response = await fetch(getPageContentUrl(titleInput));
      const parsed = await response.json();
      const result = parsed.parse.text["*"];
      this.articleTitle = parsed.parse.title.split(" ").join("_");
      const parser = new DOMParser();
      const parserDocument = parser.parseFromString(result, "text/html");
      const nodeList = parserDocument.querySelectorAll("p, #toc, h2");
      const allNode = Array.from(nodeList);
      const sections = {};
      let currentSectionHeading = "_Summary";
      for (const node of allNode) {
        if (node.tagName === "H2") {
          if (node.id === "mw-toc-heading") continue;

          currentSectionHeading = node.textContent
            .replace("[edit]", "")
            .split(" ")
            .join("_");
        } else if (node.tagName === "P") {
          if (node.className === "mw-empty-elt") continue;

          const parseText = parser.parseFromString(node.outerHTML, "text/html");
          const queryTag = parseText.querySelectorAll("a[href*='/wiki']");
          for (const tag of queryTag) {
            tag.removeAttribute("title");
            tag.classList.add("wiki-anchor");
          }
          const pTag = parseText.querySelector("p").outerHTML;
          if (!sections[currentSectionHeading]) {
            sections[currentSectionHeading] = [];
          }
          sections[currentSectionHeading].push(pTag);
        } else if (node.tagName === "DIV") {
          if (!sections["_toc"]) {
            sections["_toc"] = [];
          }
          sections["_toc"].push(node.outerHTML);
        }
      }
      this.sections = { ...sections };
      this.showDashboard = false;
      this.showExploreCard = true;

      const articleResult = await fetch(
        nodeState.getArticle({
          user_id: store.me.id,
          type: "article",
          title: this.articleTitle,
        })
      );
      const parseArticleResult = await articleResult.json();
      if (!parseArticleResult.data) {
        fetch(nodeState.createNode(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: store.me.id,
            type: "article",
            title: this.articleTitle,
            state: "started_to_read",
            section: this.sectionNames[0],
            index: 0,
          }),
        });
      } else {
        if (parseArticleResult.data.state === "started_to_read") {
          const resultIndex = parseArticleResult.data.index;
          const resultSectionName = parseArticleResult.data.section;

          this.articleColor = "border-warning";

          if (resultIndex === this.sections[resultSectionName].length - 1) {
            await this.handleGoToTableOfContent();
          } else {
            this.index = resultIndex + 1;
            await fetch(
              nodeState.updateNode({
                user_id: store.me.id,
                type: "article",
                title: this.articleTitle,
              }),
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  index: resultIndex + 1,
                  section: this.sectionName,
                }),
              }
            );
          }
        }
      }

      const card = document.querySelector(".card");
      const listener = SwipeListener(card);
      card.addEventListener("swipe", (e) => {
        const directions = e.detail.directions;

        if (directions.left) {
          this.previousParagraph();
        }
        if (directions.right) {
          this.nextParagraph();
        }
        if (directions.top) {
          this.$router.push("/");
        }
      });
    },
  },

  async mounted() {
    const dashboardData = await this.getDashboardData();
    this.startToReadArticles = dashboardData.startToReadData;
    this.readLaterArticles = dashboardData.readLaterData;
    this.showDashboard = true;
  },

  created() {
    this.$watch(
      () => this.$route.params,
      async (toParams, previousParams) => {
        if (_.isEmpty(toParams)) {
          const dashboardData = await this.getDashboardData();
          this.startToReadArticles = dashboardData.startToReadData;
          this.readLaterArticles = dashboardData.readLaterData;
          this.showExploreCard = false;
          this.showDashboard = true;
          return;
        }

        this.viewArticle(toParams.title);
      }
    );
  },

  updated() {
    const wikiAnchors = this.$refs.content.querySelectorAll("a.wiki-anchor");
    for (const anchor of wikiAnchors) {
      anchor.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        let menu = document.createElement("div");
        menu.id = "ctxmenu";
        menu.style = `top:${e.pageY - 10}px;left:${e.pageX - 40}px`;
        menu.onmouseleave = () => (ctxmenu.outerHTML = "");
        menu.onclick = () => this.handleClickContextMenu(anchor);
        menu.innerHTML = "<div class='p-1 bg-dark text-white'>Read later</div>";
        document.body.appendChild(menu);
      });

      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        this.$router.push(anchor.getAttribute("href"));
      });
    }

    const toc = this.$refs.content.querySelector("#toc");
    if (toc) {
      const sections = toc.querySelectorAll(".toclevel-1>a");
      for (const section of sections) {
        section.addEventListener("click", async (e) => {
          e.preventDefault();
          this.sectionName = section.hash.slice(1);
          this.index = 0;

          await fetch(
            nodeState.updateNode({
              user_id: store.me.id,
              type: "article",
              title: this.articleTitle,
            }),
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                index: this.index,
                section: this.sectionName,
              }),
            }
          );
        });
      }
    }
  },

  template: `
    <div class="container-fluid" style="height: 90vh">
      <div class="input-group mb-3 mt-3">
        <input id="main-input" type="text" class="form-control" placeholder="Starting article" @keyup.enter="handleSubmit" @keyup.alt.enter="handleOpen" @keyup.meta.enter="handleOpen">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" @click="handleClear">Clear</button>
          <button class="btn btn-outline-success" @click="handleOpen">Open</button>
          <button class="btn btn-outline-info" @click="handleSubmit">View</button>
        </div>
      </div>

      <div :class="[articleColor]" class="card h-100" v-show="showExploreCard" @click="handleClickCard">
        <div class="card-body d-flex flex-column position-relative">
          <div role="button" class="position-absolute translate-middle" style="top: 50%; left: 16px" @click="previousParagraph">
            <h2>
              <i class="bi bi-arrow-bar-left"></i>
            </h2>
          </div>
          <div role="button" class="position-absolute translate-middle" style="top: 50%; right: 48px" @click="nextParagraph">
            <h2>
              <i class="bi bi-arrow-bar-right"></i>
            </h2>
          </div>

          <div ref="content" class="px-5 flex-grow-1 overflow-auto py-5" v-html="this.sections[this.sectionName][this.index]"></div>
        </div>
      </div>

      <div v-show="showDashboard">
        <div class="d-flex">
          <div style="margin-right: 20px">
            <h5 class="text-center">Started to read</h5>
            <ul class='list-group'>
              <li class="list-group-item list-group-item-action" v-for="article in startToReadArticles" @click="viewCurrentArticle(article)">{{article}}</li>
            </ul>
          </div>
          <div>
            <h5 class="text-center">Read later</h5>
            <ul class='list-group'>
              <li class="list-group-item list-group-item-action" v-for="article in readLaterArticles" @click="viewCurrentArticle(article)">{{article}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
};
