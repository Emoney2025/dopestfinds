# Dopest Finds — Product-Publishing Workflow

This file permanently defines how products are added to the Dopest Finds
website. Follow these rules for every product-publishing task on this repo.

## SITE PROTECTION

- Do not redesign the website unless explicitly asked.
- Do not change the existing header, search, categories, product-card
  layout, styling, mobile layout, or existing functionality when adding
  products.
- Product additions should normally modify only `products.json` and
  approved image assets when provided.
- Never delete or alter a real existing product unless explicitly
  instructed.

## PRODUCT FORMAT

Every real product should contain:

- name
- category
- badge
- affiliate URL
- image when an approved/permitted image source is available
- emoji placeholder when an approved image is unavailable

## AMAZON

- Never invent an Amazon affiliate URL.
- Use only the affiliate URL provided by the user or an approved Amazon
  API-generated URL when that capability is available.
- Never scrape Amazon product pages for images.
- Never obtain Amazon product images from Google Images or random
  third-party sites.
- Until approved Amazon API image access is available, use only images
  provided by the user or images whose promotional/affiliate usage rights
  have been verified.
- Keep the site's Amazon Associates disclosure intact.

## PUBLISHING

- Validate `products.json` after every product addition.
- Check for duplicate products before adding one.
- Do not create duplicate placeholder and real-product entries.
- Test that existing product search/category filtering still works.
- Keep changes narrowly scoped.
- Commit product changes on a branch and create a pull request to `main`
  unless explicitly authorized to use another publishing workflow.

## FUTURE AUTOMATION

- This project is being built toward approximately 5 new affiliate
  products per day.
- The future pipeline will include product selection, approved product
  data/images, affiliate links, Dopest Finds publishing, AI UGC video
  creation, and social distribution.
- Pinterest may use a direct affiliate destination when permitted; other
  channels may send traffic to DopestFinds.shop as appropriate.
- Do not implement new external integrations without approval.
