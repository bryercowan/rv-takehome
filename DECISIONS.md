# DECISIONS.md

## 1  Assumptions
* Using US Territories not global territories based on all origin cities being within the US. This allows for a streamlined UI. Plus RevOps would more than likely be striking deals with US Companies.
* Deals only have one sales rep.

## 2  Why these assumptions felt safe
* US Based country with no seed data disproving these assumptions.
* Keeps feature scope inside 4 h target.

## 3  Key decisions & trade-offs
* Using only Three Territories vs Timezones helped narrow scope and limit over colorizing the screen. This saved me time at the trade off of a really well refined map.
* Using invalidating cache with React-Query instead of websockets. This was again to simplify the design to meet deadlines.
* Importing vs building my own components was the biggest time saver to try and deliver a very well polished feature without adding insane bloat. No package added gave any significant performance dip.
