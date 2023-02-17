# crawling-not-crawling

Download Sitemaps and Extract common folder structure

There are 3 data sets:

1. https://www.wholefoodsmarket.com/
2. https://www.dickssportinggoods.com/
3. https://www.target.com/

## Process

### Step 1

Fetch each of sitemaps (line 46-56 index.js) for each of the 3 domains based on their robots.txt file and copy/paste sitemaps into index.js (commented out in code to save you a copy/paste).

### Step 2

Download all URLs from the sitemaps and put them into the `urls_*` files.

### Step 3

Take the urls and group them into `group_*` files organizing them by folder structure starting from after the domain and working outwards.

### Raw Data

```
urls*\* - urls from sitemaps
groups*\* - urls grouped by url
```

## RUN

```
node index.js
```
