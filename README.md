## Local Development Environment Setup

1. **Install `node` 8.13.0**

   ```shell
   brew install n && n 8.13.0
   ```
2. **Install `yarn`**

   ```shell
   npm install -g yarn
   ```
3. **Clone this repository**

   ```shell
   git clone https://github.com/unisoncomputing/unisonweb-org.git
   ```
4. **Install dependencies**

   ```shell
   cd unisonweb-org && yarn install
   ```
5. **Create `.env` file**

   ```shell
   cp .env.example .env
   ```
6. **Update `.env` variables**

   ```
   ALGOLIA_INDEX_NAME=
   ALGOLIA_APP_ID=
   ALGOLIA_SEARCH_ONLY_KEY=
   ALGOLIA_ADMIN_KEY=
   ```

   These variables can be found in the following locations:
   - The ["API Keys" page](https://www.algolia.com/apps/XNXUU7UYLX/api-keys/all) in the Alogia app.
   - The ["Environment" section](https://app.netlify.com/sites/unisonweb-org/settings/deploys#environment) of Settings > Build & Deploy in the Netlify Dashboard.
7. **Start local webserver**

   ```shell
   gridsome develop
   ```

---

## Netlify Hosting

### Adding New Members

New members may be added to Netlify on the ["Members" tab](https://app.netlify.com/teams/unisoncomputing/members) of the Unison Computing team.

### Snippet Injection

Script analytics may be added to the site on the ["Post processing" section](https://app.netlify.com/sites/unisonweb-org/settings/deploys#post-processing) of Settings > Build & Deploy in the Netlify Dashboard.

Documentation: https://www.netlify.com/docs/inject-analytics-snippets

### Deploy Contexts

- A new build is deployed every time the GitHub repo changes.
- Each build gets a unique URL to preview changes.
- All deploys can be viewed on the ["Deploys" tab"](https://app.netlify.com/sites/unisonweb-org/deploys).
- Click any deploy to see the deploy log. From the deploy log screen, click "Preview deploy" to see what's been built.
- To publish changes to the live site, simply merge them into the `production` branch.

### Form processing

- Form submissions are stored in the ["Forms" tab](https://app.netlify.com/sites/unisonweb-org/forms).
- Outgoing notifications for form submiossions can be configured on the ["Form notifications" section](https://app.netlify.com/sites/unisonweb-org/settings/forms#form-notifications) of Settings > Forms.
- Form data may be piped into 3rd party applications (i.e. Mailchimp, Sendgrid, Google Sheets) by connecting with a Zapier account.

### Flipping DNS

1. [Add a custom domain](https://app.netlify.com/sites/unisonweb-org/settings/domain/setup).
2. In your DNS settings, add a CNAME record with a `name` of "www" and a `value` of "unisoncomputing-com.netlify.com".
3. Wait for DNS to propogate (usually < 5 mins).
4. Website is live.

---

## Content Editing

All editable content is located in `src/data/`.

- **Cookies Notice**
  The wording for the cookies notice can be found in `src/data/components/cookies-notice.yml`.
- **Site Navigation**
  A list of links can be found in `src/data/components/site-nav.yml`.
- **Docs Sidebar**
  A list of links can be found in `src/data/components/doc-sidebar.yml`.
- **Docs Pages**
  Page content is stored as markdown in `src/data/docs/`.

  Each markdown file must include frontmatter with `title` and `description` properties. These properties are used in the `<title>` and `<meta name="description">` tags in the `<head>` of each page:

  ```md
  ---
  title: An Interesting Title
  description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  ---
  ```

  Codeblocks also have (optional) frontmatter for altering how they are rendered:

  ````md
  ```unison
  ---
  title: output
  filename: filename
  ---
  42, 9.7, 1e100, "hello", +99, -42, true, false -- various literals
  ````

  `title` can be any value with eight (8) characters or less.
  `filename` can be any value with fifty (50) characters or less.
- **Blog Posts**
  Post content is stored as markdown in `src/data/blog/posts/`. Each markdown file should be named `index.md` and placed into folder (along with related images) named like so:

  `2019-04-04-writeup-of-our-first-unison-meetup`

  This ^ naming convention will yield the following permalink: `www.unisonweb.org/2019/04/04/writeup-of-our-first-unison-meetup`

  In addition to the `title` and `description` properties, each markdown file's frontmatter must also include a `date`, `author`, and `categories` property:

  ```md
  ---
  title: Writeup of our first Unison meetup
  description: placeholder
  date: 2019-04-04
  author: Paul Chuisano
  categories: ["news"]
  ---
  ```
- **Blog Categories**
  Categories are defined as markdown files in `src/data/blog/categories/`.

  Each markdown file's frontmatter should include `id`, `title`, `emoji`, and `color` properties like so:

  ```md
  ---
  id: engineering
  title: Engineering
  emoji: ⚛️
  color: pink
  ---
  ```

  The value for the `color` property should match the name of a color defined in `src/data/colors.yml`.
---

## Website Colors

The names and hex values for all colors used across the site are located in [`src/data/colors.yml`](https://github.com/unisoncomputing/unisonweb-org/blob/master/src/data/colors.yml). To change a color, simply call the `palette()` function with the name the color you'd like to reference.

```scss
.element {
  color: palette(purple);
}
```

By default, the `palette()` function will return the `base` hex value (defined the `src/data/colors.yml`). Optionally, you may pass a second argument to return the value of the related `tone`.

```scss
.element {
  color: palette(blue, dark);
}
```

All available tones are defined in [`src/assets/styles/config/_palettes.scss`](https://github.com/unisoncomputing/unisonweb-org/blob/master/src/assets/styles/config/_palettes.scss#L3-L13), and are listed below for your convenience:

- `xxx-dark`: 80% dark
- `xx-dark`: 55% dark
- `x-dark`: 45% dark
- `dark`: 20% dark
- `mid`: 20% light
- `light`: 45% light
- `x-light`: 60% light
- `xx-light`: 75% light
- `xxx-light`: 90% light

## Syntax Highlighting

Colors for syntax highlighting in codeblocks are defined in `src/assets/styles/common/codeblock/_tokens.scss`:

```scss
.token {

  @at-root .un-codeblock & {

    &.comment { color: palette(gray, light); }
    &.char {}
    &.string { color: palette(black); }
    &.keyword { color: palette(green); }
    &.import_statement {}
    &.builtin { color: palette(blue); }
    &.number { color: palette(green); }
    &.operator { color: palette(green); }
    &.hvariable { color: palette(gray, xx-dark); }
    &.constant { color: palette(purple); }
    &.punctuation { color: palette(pink); }

  }
}
```

Regex patterns to identify tokens are defined here: https://github.com/brianfryer/prism/blob/master/components/prism-unison.js.

> Eventually, the regex patterns need to be updated to match the Unison language. Once complete, a PR should be submitted to include Unison syntax highlighting in the main repository.

